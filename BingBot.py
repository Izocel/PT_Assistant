from EdgeGPT import Chatbot, ConversationStyle
import re

class BingBot:
    def __init__(self) -> None:
        pass
    
    async def init(self):
        self.bot = await Chatbot.create()
        
    async def parse(self, user_input):
        response = await self.bot.ask(prompt=user_input, conversation_style=ConversationStyle.precise)
        
        # Select only the bot response from the response dictionary
        for message in response["item"]["messages"]:
            if message["author"] == "bot":
                bot_response = message["text"]

        # Remove [^#^] citations in response
        
        return re.sub(
            '\[\^\d+\^\]', '', bot_response)