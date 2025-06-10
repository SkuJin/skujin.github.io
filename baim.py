import requests
import random
import string
import time

# Настройки
CLOUDFLARE_PROXY_URL = "https://wispy-pond-aa69.virtualmachineholder420.workers.dev/"
BASE_URL = "https://t.me/getoutfucking"

# Список отправленных сообщений для избежания дубликатов
sent_messages = set()

# Список User-Agent'ов (оригинальные + 20 новых)
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15",
    "Mozilla/5.0 (Linux; Android 11; SM-G960F) AppleWebKit/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.48",
    "Mozilla/5.0 (Linux; Android 10; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.111 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:24.0) Gecko/20100101 Firefox/24.0",
    "Mozilla/5.0 (iPod touch; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46",
    "Mozilla/5.0 (Linux; Android 11; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7",
    "Mozilla/5.0 (X11; OpenBSD i386) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1"
]

# Счётчик запросов
request_counter = 0

# Функция для генерации случайной строки (8 символов)
def generate_random_string(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

# Функция для замены букв с большим разнообразием
def replace_letters(text):
    replacements = {
        'F': ['ph', 'ƒ'],
        'C': ['K', '¢'],
        'K': ['X', 'k'],
        'N': ['И', 'И']
    }
    result = []
    for char in text:
        if char in replacements:
            result.append(random.choice(replacements[char]))
        else:
            result.append(char)
    return ''.join(result)

# Функция для добавления случайных пробелов и вариаций
def add_variations(text):
    words = text.split()
    varied_words = []
    for word in words:
        spaces = ' ' * random.randint(0, 3)
        if random.choice([True, False]):
            varied_words.append(spaces + word)
        else:
            varied_words.append(spaces + word[::-1])
    extra_phrases = ["LOL", "XD", "ROFL"] if random.random() > 0.7 else []
    return ' '.join(varied_words + extra_phrases).strip()

# Данные для POST-запроса
def prepare_payload():
    base_phrase = f".ROBLOSECURITY GET {random.choice(['FUCK1ИG', 'phUCK1ИG', 'ƒUCK1ИG'])} BY {BASE_URL}"
    modified_phrase = replace_letters(base_phrase)
    varied_phrase = add_variations(modified_phrase)
    random_suffix = generate_random_string()
    
    content = f"{varied_phrase} {random_suffix}"
    while content in sent_messages:
        random_suffix = generate_random_string()
        content = f"{varied_phrase} {random_suffix}"
    
    sent_messages.add(content)
    return {"content": content}

# Функция для отправки запроса
def send_post_request():
    global request_counter
    request_counter += 1
    
    # Выбор нового User-Agent после каждого запроса
    current_ua_index = (request_counter - 1) % len(USER_AGENTS)
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENTS[current_ua_index]
    }

    payload = prepare_payload()

    try:
        response = requests.post(CLOUDFLARE_PROXY_URL, json=payload, headers=headers, timeout=10)
        if response.status_code == 200:
            print(f"Успешно! Статус код: {response.status_code}")
            print(f"Отправлено: {payload['content']}")
            print(f"User-Agent: {headers['User-Agent']}")
            print(f"Ответ сервера: {response.text}")
        else:
            print(f"Ошибка! Статус код: {response.status_code}")
            print(f"Ответ сервера: {response.text}")
            print(f"User-Agent: {headers['User-Agent']}")
    except requests.exceptions.RequestException as e:
        print(f"Произошла ошибка: {e}")
        print(f"User-Agent: {headers['User-Agent']}")

# Основной цикл
if __name__ == "__main__":
    while True:
        print(f"Отправка запроса в {time.strftime('%H:%M:%S', time.localtime())}")
        send_post_request()
        time.sleep(5)  # Интервал 1 секунда для стабильности
