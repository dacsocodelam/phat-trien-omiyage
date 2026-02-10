#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để chuyển toàn bộ descriptions trong omiyageData.ts sang tiếng Nhật
"""

# Dictionary mapping English descriptions to Japanese
translations = {
    # Prefecture descriptions
    "The capital city, blending the ultramodern and the traditional.": "伝統と最先端が融合する日本の首都",
    "Famous for vast nature, powder snow, and fresh seafood.": "雄大な自然とパウダースノー、新鮮な海の幸",
    "The heart of traditional Japan, famous for kaiseki arranging and temples.": "千年の都、寺社仏閣と伝統文化の中心地",
    "Japan's kitchen, famous for street food and vibrant culture.": "天下の台所、たこ焼きとお笑いの街",
    "Home to Yokohama port and Kamakura's historical temples.": "横浜港と鎌倉の古都を擁する",
    "Nagoya's castle town, famous for unique strong-flavored cuisine.": "名古屋城の城下町、独特の味噌文化",
    "Northernmost Honshu, famous for apples and Nebuta Festival.": "本州最北端、りんごとねぶた祭りの郷",
    "Land of wanko soba and beautiful coastlines.": "わんこそばと美しい三陸海岸",
    "Home to Sendai and delicious beef tongue.": "杜の都仙台、牛タンとずんだの街",
    "Famous for rice, sake, and Namahage folklore.": "米と酒、なまはげ民俗の里",
    "Cherry capital and hot spring paradise.": "さくらんぼ王国と温泉天国",
    "Peach country with beautiful castles and hot springs.": "桃源郷、名城と温泉の地",
    "Natto homeland and agricultural powerhouse.": "納豆の本場、農業大国",
    "Home to Nikko shrines and gyoza paradise.": "日光東照宮と餃子の街",
    "Hot spring haven and konnyaku capital.": "温泉天国、こんにゃくの里",
    "Tokyo's neighbor, famous for sweet potato and bonsai.": "東京の隣、盆栽とさつまいもの街",
    "Home to Narita Airport and Tokyo Disneyland.": "成田空港と東京ディズニーランド",
    "Rice and sake kingdom with heavy snow.": "米と酒の王国、豪雪地帯",
    "Alpine region famous for firefly squid.": "立山連峰とホタルイカの里",
    "Kanazawa's gold leaf and seafood paradise.": "金沢の金箔と海の幸",
    "Dinosaur fossils and Echizen crab country.": "恐竜化石と越前ガニの国",
    "Mt. Fuji's home and grape/wine capital.": "富士山と葡萄・ワインの郷",
    "Alpine wonderland with apples and soba.": "アルプスの山岳リゾート、りんごと蕎麦",
    "Cormorant fishing and Hida beef land.": "鵜飼と飛騨牛の里",
    "Mt. Fuji, green tea, and eel paradise.": "富士山、緑茶、うなぎの街",
    "Ise Shrine and spiny lobster coast.": "伊勢神宮と伊勢海老の海岸",
    "Lake Biwa and ancient temples.": "琵琶湖と古代寺院",
    "Kobe beef and Himeji Castle.": "神戸ビーフと姫路城",
    "Ancient capital with sacred deer.": "古都奈良、神鹿の里",
    "Mikan orange paradise and Kumano pilgrimage.": "みかんの楽園と熊野古道",
    "Sand dunes and pear kingdom.": "砂丘と梨王国",
    "Sunshine land with peaches and Momotaro legend.": "晴れの国、桃太郎伝説の地",
    "Peace city famous for okonomiyaki and oysters.": "平和都市、お好み焼きと牡蠣",
    "Westernmost Honshu, fugu and history.": "本州最西端、ふぐと歴史",
    "Awa Odori dance and indigo dye.": "阿波踊りと藍染めの里",
    "Udon kingdom and Seto Inland Sea.": "うどん県、瀬戸内海",
    "Mikan paradise and Dogo Onsen.": "みかん王国と道後温泉",
    "Bonito tataki and Sakamoto Ryoma's home.": "鰹のたたきと坂本龍馬の故郷",
    "Hakata ramen and mentaiko paradise.": "博多ラーメンと明太子の都",
    "Pottery town and seaweed coast.": "陶磁器の街と有明海苔",
    "International port with Castella cake.": "国際港湾都市とカステラ",
    "Kumamon's home and horse meat cuisine.": "くまモンの故郷、馬肉料理",
    "Hot spring capital 'Onsen Prefecture'.": "温泉首都「おんせん県」",
    "Tropical paradise with mango and chicken nanban.": "南国パラダイス、マンゴーとチキン南蛮",
    "Sakurajima volcano and shochu distilleries.": "桜島と焼酎の里",
    "Tropical islands with unique Ryukyu culture.": "琉球文化が息づく南の島々",
}

# Specialty name descriptions (brief descriptions)
specialty_desc = {
    "Soft banana-flavored sponge cake with creamy custard filling.": "バナナ風味のふんわりスポンジにカスタードクリーム",
    "Small cakes shaped like dolls, filled with sweet red bean paste.": "人形の形をした小さなケーキ、あんこ入り",
    "Crispy rice crackers mixed with peanuts and sugar, famous from Asakusa.": "浅草名物、ピーナッツと砂糖の香ばしいお菓子",
    "White chocolate-coated langue de chat cookies from Hokkaido.": "北海道銘菓、白い恋人のラングドシャクッキー",
    "Smooth, melt-in-mouth fresh chocolate squares.": "口どけなめらかな生チョコレート",
    "Crunchy potato sticks with Hokkaido butter and salt.": "北海道産バターと塩のカリカリポテト",
    "Delicate sweet filled with red bean paste and cinnamon.": "八ツ橋、シナモン香るあんこ菓子",
    "Premium powdered green tea from Uji.": "宇治抹茶の最高級品",
    "Traditional pickled vegetables, Kyoto-style.": "京都の伝統的な漬物",
    "Steamed pork buns from Chinatown.": "551蓬莱の豚まん",
    "Crispy takoyaki-flavored rice crackers.": "たこ焼き味のサクサクせんべい",
    "Butter cookies shaped like doves.": "鳩の形をしたバタークッキー",
    "Steamed pork and onion dumplings.": "横浜名物シュウマイ",
    "Sweet rice cake with kinako and syrup.": "外郎、きな粉と黒蜜の餅菓子",
    "Chicken wing-flavored crackers.": "手羽先味のサクサククッキー",
    
    # 続きを追加...
}

print("Translation dictionary created.")
print(f"Total prefecture descriptions: {len(translations)}")
print(f"Total specialty descriptions: {len(specialty_desc)}")
