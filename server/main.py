from flask import Flask
from time import sleep
import asyncio
import whisper
import speech_recognition
import sentry_sdk
from BingBot import BingBot
from GptBot import GptBot
from PollySpeechSynth import PollySpeechSynth

from dotenv import dotenv_values
config = dotenv_values(".env")

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!\n I'm a AI powered Flask API, "

if config["sentry_env"] != 'production':
    sentry_sdk.init(
        dsn=config["sentry_dsn"],
        environment=config["sentry_env"],
        release=config["version"],
        traces_sample_rate=1.0
    )

BING_WAKE_WORD = "bing"
GPT_WAKE_WORD = "google"
appName = config["name"] + "|v" + config["version"]

polly = PollySpeechSynth()
bingBot = BingBot()
gptBot = GptBot()

# Create a recognizer object and wake word variables
recognizer = speech_recognition.Recognizer()

async def main():
    await bingBot.init()

    while True:
        with speech_recognition.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source)

            awaitSentence = "Waiting for wake words: '" + \
                            BING_WAKE_WORD + " or '" + GPT_WAKE_WORD + "'..."

            print(awaitSentence)
            while True:
                audio = recognizer.listen(source)
                try:
                    with open("audio.wav", "wb") as f:
                        f.write(audio.get_wav_data())

                    # Use the preloaded tiny_model
                    model = whisper.load_model("tiny")
                    result = model.transcribe("audio.wav")
                    phrase = result["text"]

                    print(f"You said: {phrase}")

                    wake_word = get_wake_word(phrase)
                    if wake_word is not None:
                        break
                    else:
                        print("Not a wake word. Try again.")

                except Exception as e:
                    print("Error transcribing audio: {0}".format(e))
                    continue

            print("Speak a prompt...")

            polly.text_to_speech('What can I help you with?')
            audio = recognizer.listen(source)

            try:
                with open("audio_prompt.wav", "wb") as f:
                    f.write(audio.get_wav_data())

                model = whisper.load_model("base")
                result = model.transcribe("audio_prompt.wav")
                user_input = result["text"]

                print(f"You said: {user_input}")

            except Exception as e:
                print("Error transcribing audio: {0}".format(e))
                continue

            bot_response = "I was not able to get any awnser"
            if wake_word == BING_WAKE_WORD:
                bot_response = await bingBot.parse(user_input)

            elif wake_word == GPT_WAKE_WORD:
                bot_response = gptBot.parse(user_input)

        print("Bot's response:", bot_response)
        polly.text_to_speech(bot_response)
        sleep(1)


def get_wake_word(phrase):
    phrase = phrase.lower()
    if BING_WAKE_WORD in phrase:
        return BING_WAKE_WORD
    elif GPT_WAKE_WORD in phrase:
        return GPT_WAKE_WORD
    else:
        return None


def synth_res_toFile(response, output_filename):
    with open(output_filename, 'wb') as f:
        f.write(response['AudioStream'].read())


if __name__ == "__main__":
    asyncio.run(main())
