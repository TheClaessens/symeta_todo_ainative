"""Application settings and configuration."""

import logging
from functools import lru_cache

from pydantic import Field
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    PyprojectTomlConfigSettingsSource,
    SettingsConfigDict,
)

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings loaded from environment variables.

    By default, the settings are loaded from the following sources in order:
    1. Init settings (from class initialization)
    2. Environment variables
    3. .env file
    4. File secrets
    5. pyproject.toml

    This can be extended by overriding the settings_customise_sources method.

    For settings or constants that require a one-time initialization, it is recommended to use the computed_field decorator. These settings can make use of self in order to access non-initialized settings.

    For example:

    ```python
        @computed_field
        @cached_property
        def AZURE_CREDENTIAL(self) -> ManagedIdentityCredential | DefaultAzureCredential:
            try:
                # Try DefaultAzureCredential first
                default_credential = DefaultAzureCredential()
                return default_credential
            except Exception:
                try:
                    # Fallback to ManagedIdentityCredential
                    managed_credential = ManagedIdentityCredential(
                        client_id=self.AZURE_CLIENT_ID
                    )
                    return managed_credential
                except Exception as e:
                    logger.error(
                        f"All credential attempts failed. ManagedIdentityCredential error: {e}"
                    )
                    raise CredentialUnavailableError(
                        "Failed to obtain working credentials using both DefaultAzureCredential and ManagedIdentityCredential"
                    )
    ```

    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        pyproject_toml_table_header=("project",),
        pyproject_toml_depth=3,
        case_sensitive=False,
        populate_by_name=True,
        extra="ignore",
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        """Customize the settings sources for the Settings class.

        This method defines where the settings are loaded from. By default it is configured to use the following sources in order:
        1. Init settings (from class initialization)
        2. Environment variables
        3. .env file
        4. File secrets
        5. Azure Key Vault (if configured)

        This method customizes how settings are loaded by adding Azure Key Vault as an additional
        settings source. Settings are loaded in the following order:
        1. Init settings (from class initialization)
        2. Environment variables
        3. .env file
        4. File secrets
        5. pyproject.toml

        Note: It is possible to extend this method by adding additional settings sources. For example, to add Azure Key Vault, you can add the following code:
        ```python
        return (
            init_settings,
            env_settings,
            dotenv_settings,
            file_secret_settings,
            PyprojectTomlConfigSettingsSource(settings_cls=settings_cls),
            AzureKeyVaultSettingsSource(
                settings_cls,
                f"https://{key_vault_name}.vault.azure.net/",
                DefaultAzureCredential(),
            )
        )
        ```
        key_vault_name is a variable that should be defined either within the function itself or explicitly retrieved from the environment variables.

        Args:
            settings_cls (type[BaseSettings]): The Settings class type
            init_settings (PydanticBaseSettingsSource): Settings from class initialization
            env_settings (PydanticBaseSettingsSource): Settings from environment variables
            dotenv_settings (PydanticBaseSettingsSource): Settings from .env file
            file_secret_settings (PydanticBaseSettingsSource): Settings from file secrets

        Returns:
            tuple[PydanticBaseSettingsSource, ...]: Tuple of settings sources in priority order
        """
        return (
            init_settings,
            env_settings,
            dotenv_settings,
            file_secret_settings,
            PyprojectTomlConfigSettingsSource(settings_cls=settings_cls),
        )

    # Server configuration
    host: str = Field("0.0.0.0", description="The host to bind the server to")  # nosec B104 - Development server binding to all interfaces
    port: int = Field(8000, description="The port to bind the server to")
    debug: bool = False

    # Application settings (By default retrieved from pyproject.toml)
    name: str = Field(default="Kickstarter API", description="The name of the application")
    version: str = Field(default="0.1.0", description="The version of the application")
    description: str = Field(default="A minimal FastAPI application", description="The description of the application")

    # API settings
    docs_url: str = Field("/docs", description="The URL of the docs")
    redoc_url: str = Field("/redoc", description="The URL of the redoc")


@lru_cache
def get_settings(**kwargs) -> Settings:
    """Get the settings."""
    return Settings(**kwargs)
