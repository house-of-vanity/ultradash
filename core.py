import yaml


class Core:
    def __init__(self, config):
        with open(config, 'r') as config:
            self.config = yaml.load(config)
        self.get_weather()

    def get_weather(self):
        print(self.config['services']['weather']['api_key'])



Core(config='config.yaml')