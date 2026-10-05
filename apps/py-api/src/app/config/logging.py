import logging
import logging.config
import os

import coloredlogs
import yaml


def setup_logging(default_path="logging.yaml", default_level=logging.INFO):
    """Configure logging for the application.

    This function sets up logging configuration from a YAML file or environment variable.
    If neither is available, it falls back to basic logging configuration.

    Args:
        default_path (str, optional): Path to the logging config YAML file.
            Defaults to "logging.yaml".
        default_level (int, optional): Default logging level if config fails.
            Defaults to logging.INFO.
    """
    path = default_path
    if os.path.exists(path=path):
        if ".." in path:
            raise Exception("Invalid file path")
        with open(path, "rt") as f:
            try:
                config = yaml.safe_load(stream=f.read())
                logging.config.dictConfig(config=config)
                coloredlogs.install()
            except Exception as e:
                logging.basicConfig(level=default_level)
                coloredlogs.install(level=default_level)
                logging.warning("Error in Logging Configuration. Using default configs: %s", e)
    else:
        logging.basicConfig(level=default_level)
        coloredlogs.install(level=default_level)
        logging.warning("Failed to load configuration file. Using default configs")
