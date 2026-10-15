from .openai import OpenAI

# Put your API key here
client = OpenAI(api_key="YOUR_API_KEY")

print("🤖 AI Friend")
print("Type 'quit' to stop.\n")

conversation = [
    {
        "role": "system",
        "content": (
            "You are a friendly AI companion. "
            "Be kind, helpful, conversational, and age-appropriate. "
            "Do not pretend to be a real human."
        )
    }
]

while True:
    user_message = input("You: ")

    if user_message.lower() == "quit":
        print("AI Friend: Bye! 👋")
        break

    conversation.append({
        "role": "user",
        "content": user_message
    })

    response = client.responses.create(
        model="gpt-5",
        input=conversation
    )

    reply = response.output_text

    print("AI Friend:", reply)

    conversation.append({
        "role": "assistant",
        "content": reply
    })