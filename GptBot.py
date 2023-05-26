import openai

from dotenv import dotenv_values
config = dotenv_values(".env")

class GptBot:
    def __init__(self) -> None:
        openai.api_key = config["openai_api_secret_key"]

    def parse(self, user_input):
        # Send prompt to GPT-3.5-turbo API
        responses = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content":
                 "You are a helpful assistant."},
                {"role": "user", "content": user_input},
            ],
            temperature=0.5,
            max_tokens=150,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            n=1,
            stop=["\nUser:"],
        )
        return responses["choices"][0]["message"]["content"]
