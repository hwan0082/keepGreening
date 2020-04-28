from config.defaultConfig import DefaultConfig


class ProductionConfig(DefaultConfig):
    DEBUG = False
    TESTING = False
