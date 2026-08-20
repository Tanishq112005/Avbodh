from langchain_mcp_adapters.client import MultiServerMCPClient
from .registry import CONNECTOR_CATALOG, AuthType


class AvbodhMCPClientFactory:
    """
    Kaam: (1) tools discover karna (2) unhe execute karna, jab LLM bulaye.
    Loop/decision ka koi kaam nahi — wo agent/graph.py mein hota hai.
    """

    _instances: dict[str, MultiServerMCPClient] = {}   # user_id → client
    _tools_cache: dict[str, list] = {}                   # user_id → tools list

    @classmethod
    def _build_server_config(cls, enabled_connectors: list[dict]) -> dict:
        config = {}
        for entry in enabled_connectors:
            spec = CONNECTOR_CATALOG[entry["connector_id"]]
            creds = entry.get("credentials", {})

            if spec.transport == "stdio":
                env = {}
                if spec.auth_type == AuthType.PAT and spec.required_fields:
                    env[f"{spec.id.upper()}_API_KEY"] = creds[spec.required_fields[0]]
                config[spec.id] = {"command": spec.command, "args": spec.args, "env": env, "transport": "stdio"}
            else:
                headers = {}
                if spec.auth_type in (AuthType.PAT, AuthType.OAUTH):
                    token = creds.get("personal_access_token") or creds.get("access_token")
                    headers["Authorization"] = f"Bearer {token}"
                config[spec.id] = {"url": spec.url, "headers": headers, "transport": spec.transport}
        return config



    @classmethod
    async def get_tools(cls, user_id: str, enabled_connectors: list[dict]):
        if user_id not in cls._tools_cache:
            try:
                server_config = cls._build_server_config(enabled_connectors)
                client = MultiServerMCPClient(server_config)
                cls._instances[user_id] = client
                cls._tools_cache[user_id] = await client.get_tools()
                print(f"[MCP] user={user_id} — {len(cls._tools_cache[user_id])} tools loaded")
            except Exception as e:
                raise RuntimeError(f"Failed to initialize MCP client for user {user_id}: {e}")
        return cls._tools_cache[user_id]


    @classmethod
    def invalidate(cls, user_id: str):
        """User naya connector add/remove kare to cache saaf karo"""
        cls._instances.pop(user_id, None)
        cls._tools_cache.pop(user_id, None)
        
    @classmethod
    async def get_resources(cls, user_id: str, server_name: str, uris: list[str]):
        """User ka client already cache mein hona chahiye (get_tools pehle call ho chuka ho)"""
        client = cls._instances.get(user_id)
        if client is None:
            raise RuntimeError(f"No MCP client for user {user_id} — call get_tools() first")
        return await client.get_resources(server_name, uris=uris)

    @classmethod
    async def get_prompt(cls, user_id: str, server_name: str, prompt_name: str, arguments: dict | None = None):
        client = cls._instances.get(user_id)
        if client is None:
            raise RuntimeError(f"No MCP client for user {user_id} — call get_tools() first")
        return await client.get_prompt(server_name, prompt_name, arguments=arguments)    