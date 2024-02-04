# This url are the one that need to be changed accordingly to what is happening in the world
temporal_urls_to_scrape = [
    "https://news.google.com/search?q=palestine&hl=en-US&gl=US&ceid=US%3Aen",
    "https://news.google.com/search?q=isreael&hl=en-US&gl=US&ceid=US%3Aen",
    "https://news.google.com/search?q=conflicts&hl=en-US&gl=US&ceid=US%3Aen"
]

urls_to_scrape = [
    "https://news.google.com/topstories?hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFZ4ZERBU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen",
    "https://news.google.com/u/1/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNR2RtY0hNekVnSmxiaWdBUAE?hl=en-US&gl=US&ceid=US%3Aen",
    "https://news.google.com/u/1/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNREp3ZVRBNUVnSmxiaWdBUAE?hl=en-US&gl=US&ceid=US%3Aen",

    "https://news.google.com/topics/CAAqJAgKIh5DQkFTRUFvS0wyMHZNSFp3YWpSZlloSUNaVzRvQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen",
    "https://news.google.com/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE?hl=en-US&gl=US&ceid=US%3Aen",
    "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNREpmTjNRU0FtVnVLQUFQAQ/sections/CAQiQ0NCQVNMQW9JTDIwdk1ESmZOM1FTQW1WdUlnOElCQm9MQ2drdmJTOHdNVE41TjNrcUN4SUpMMjB2TURFemVUZDVLQUEqJQgAKiEICiIbQ0JBU0Rnb0lMMjB2TURKZk4zUVNBbVZ1S0FBUAFQAQ?hl=en-US&gl=US&ceid=US%3Aen",
    "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNREpmTjNRU0FtVnVLQUFQAQ/sections/CAQiV0NCQVNPd29JTDIwdk1ESmZOM1FTQW1WdUlnOElCQm9MQ2drdmJTOHdPWGswY0cwcUdnb1lDaFJOUVZKTFJWUlRYMU5GUTFSSlQwNWZUa0ZOUlNBQktBQSolCAAqIQgKIhtDQkFTRGdvSUwyMHZNREpmTjNRU0FtVnVLQUFQAVAB?hl=en-US&gl=US&ceid=US%3Aen"
]
black_listed_domains = [
    "bloomberg.com",
    "nytimes.com",
    "youtube.com",
    "macrobusiness.com.au",
    "telegraph.co.uk",
    "vanityfair.com"
]

categories = ['Politics', 'Economy', 'Environment']
subcategories = [
    [
        "Elections",
        "International Relations",
        "Policy Reforms",
        "Legislation",
        "Civil Rights",
        "Defence And Security",
        "Local Governance",
        "Politics Scandals",
        "Public Opinion",
        "Others"
    ],
    [
        "Global Economy",
        "Stock Market",
        "Banking",
        "Real Estate",
        "Cryptocurrencies",
        "Insurance",
        "Taxation",
        "Corporate Finance",
        "Economic Policies",
        "Others"
    ],
    [
        "Climate Change",
        "Renewable Energy",
        "Wildlife",
        "Pollution",
        "Natural Disasters",
        "Agriculture",
        "Water Resources",
        "Environment Laws",
        "Biodiversity",
        "Others"
    ]
]