import pydub
from pydub import playback
from pydub import AudioSegment


class AudioPlayer:
    def __init__(self):
        self.player = pydub

    def play_audio(file, format="mp3"):
        sound = AudioSegment.from_file(file, format)
        playback.play(sound)
