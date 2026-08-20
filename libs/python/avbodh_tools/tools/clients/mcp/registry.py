from dataclasses import dataclass, field
from enum import Enum


class AuthType(Enum):
    NONE = "none"          # koi credential nahi chahiye (jaise apna filesystem server)
    PAT = "pat"            # user apna token/key paste karta hai
    OAUTH = "oauth"        # browser se login (baad mein banayenge)


@dataclass
class ConnectorSpec:
    id: str
    name: str
    transport: str                  # "stdio" ya "streamable_http"
    auth_type: AuthType
    command: str | None = None       # stdio ke liye
    args: list[str] = field(default_factory=list)
    url: str | None = None           # http ke liye
    required_fields: list[str] = field(default_factory=list)


CONNECTOR_CATALOG: dict[str, ConnectorSpec] = {
    "github": ConnectorSpec(
        id="github", name="GitHub", transport="streamable_http",
        auth_type=AuthType.PAT, url="https://api.githubcopilot.com/mcp/",
        required_fields=["personal_access_token"],
    ),
    "tavily": ConnectorSpec(
        id="tavily", name="Tavily search", transport="stdio",
        auth_type=AuthType.PAT, command="npx", args=["-y", "tavily-mcp"],
        required_fields=["api_key"],
    ),
}