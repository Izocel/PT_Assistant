import boto3
from botocore.config import Config
from AudioPlayer import AudioPlayer

from dotenv import dotenv_values
config = dotenv_values(".env")

class PollySpeechSynth:
    synth_voice_id = 'Salli'
    synth_engine = 'neural'

    def __init__(self):
        self.AwsClientConfig = self.getAwsConfig()
        self.polly = boto3.client('polly', config=self.AwsClientConfig)

    def getAwsConfig(self):
        return Config(region_name=config["aws_region"])

    def synthetize(self, text):
        return self.polly.synthesize_speech(
            Text=text,
            OutputFormat='mp3',
            VoiceId=self.synth_voice_id,
            Engine=self.synth_engine
        )
        
    def text_to_speech(self, text):
        response = self.synthetize(text)
        with open('response.mp3', 'wb') as f:
            f.write(response['AudioStream'].read())
        AudioPlayer.play_audio('response.mp3')

