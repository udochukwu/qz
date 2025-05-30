import os
import json
import time
import openai
import requests
from munch import munchify

# Set up OpenAI API credentials

# Function to translate text using GPT-3.5 model
#TODO for french and other languges it escapes \\ the ' when it shouldnt, because the output is in a form of a string. Need to fix this.

def translate_text(text, context, target_language, max_retries=5, backoff_factor=0.5):
    for i in range(max_retries):
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            'x-api-key': '',  # replace with your Claude API key
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        }
        data = {
            "model": "claude-3-sonnet-20240229",
            "messages": [
                {"role": "user", "content": f"Translate '{text}' from English text to {target_language}, this is some context: {context} if a translation doesnt exist just output '{text}'.You can output a better contextual translation if it exist instead of word by word. Return the translation directly ONLY, using the following format: {{'translation': <translated response>}}"}
            ],
            "max_tokens": 350,
            "temperature": 0
        }

        try:
            with requests.Session() as session:
                response = session.post(
                    url, headers=headers, data=json.dumps(data), timeout=10)
                response.raise_for_status()
                response_json = response.json()
                response.close()
                completion = munchify(response_json)
            if session:
                session.close()

            translation = completion['content'][0]['text']  # Updated path to get response content

            translation = translation.replace("{'translation': ", "")
            # remove the last }
            translation = translation.rsplit('}', 1)[0]
            # Remove quotes from translation
            if translation.startswith("'") and translation.endswith("'") and not text.startswith("'") and not text.endswith("'"):
                translation = translation[1:-1]
            if translation.startswith('"') and translation.endswith('"') and not text.startswith('"') and not text.endswith('"'):
                translation = translation[1:-1]
            return translation

        except Exception as e:
            if i == max_retries - 1:  # This was the last attempt
                raise e  # Re-raise the last exception
            else:
                # exponential backoff
                time.sleep((2 ** i) * backoff_factor)


def translate_json(json_str, context, language):
    # Load JSON string into a Python object
    obj = json.loads(json_str)

    # Check each key's value
    for key in obj:
        value = obj[key]
        if isinstance(value, dict):
            obj[key] = translate_json(json.dumps(value), context, language)
        else:
            # Update the context with the latest key-value pair
            if len(context) == 5:
                context.pop(0)
            context.append({key: value})

            obj[key] = translate_text(value, context, language)

    return obj


def compare_keys(obj1, obj2, language="", path="", context=[]):
    # Check for keys in obj1 that are not in obj2
    for key in obj1:
        if key not in obj2:
            print(f"Key '{path}.{key}' not found in {language}.")
            if isinstance(obj1[key], dict):
                translated_text = translate_json(
                    json.dumps(obj1[key]), context, language)
            else:
                # Update the context with the latest key-value pair
                if len(context) == 5:
                    context.pop(0)
                context.append({key: obj1[key]})

                translated_text = translate_text(obj1[key], context, language)

            # Add the new key to obj2
            obj2[key] = translated_text
        else:
            value1 = obj1[key]
            value2 = obj2[key]
            if isinstance(value1, dict) and isinstance(value2, dict):
                # Update the context with the latest key-value pair
                if len(context) == 5:
                    context.pop(0)
                context.append({key: obj1[key]})

                compare_keys(value1, value2, language,
                             path + "." + key, context)

    # Check for keys in obj2 that are not in obj1
    for key in obj2:
        if key not in obj1:
            print(f"Key '{path}.{key}' found in {language} but not in 'en'.")



# Get the current working directory
cwd = os.getcwd()

# Get the list of files in the locales folder
files = os.listdir(cwd)

# Loop through the files and print the names
languages = []
for file in files:
    if file.endswith(".json"):
        languages.append(file[:-5])

# Load the English JSON file
en = json.load(open("en.json"))

# Make sure every language has the same keys
for language in languages:
    print(language)
    lang = json.load(open(language + ".json"))
    compare_keys(en, lang, language)
    # Write the updated dictionary back to the JSON file
    with open(language + ".json", 'w') as fp:
        json.dump(lang, fp, indent=4, sort_keys=True)
