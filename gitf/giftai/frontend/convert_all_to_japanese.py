#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Convert ALL English descriptions in omiyageData.ts to Japanese"""

import re

# Read the file
with open('src/data/omiyageData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Comprehensive translation dictionary
translations = {
    # Hokkaido
    "White chocolate sandwich cookies, Hokkaido's most famous souvenir.": "北海道の最も有名なお土産、白いチョコレートサンドクッキー",
    "Meaning 'White Lover', created in 1976. The crispy langue de chat cookie with white chocolate represents Hokkaido's pure white snow.": "「白い恋人」という意味で、1976年に誕生。サクサクのラングドシャクッキーと白いチョコレートが北海道の真っ白な雪を表現しています。",
    "Silky smooth chocolate with fresh cream, dusted with cocoa powder.": "生クリーム入りのなめらかなチョコレート、ココアパウダーをまぶしてあります",
    "'Nama' means 'fresh'—these must be refrigerated! Melts instantly in your mouth with rich Hokkaido milk.": "「生」は新鮮という意味で、要冷蔵！北海道産の濃厚なミルクで口の中で瞬時に溶けます。",
    "Crispy potato sticks made from 100% Hokkaido potatoes.": "北海道産じゃがいも100%で作られたサクサクのポテトスティック",
    "Infused with real butter and salt from Hokkaido. The perfect beer snack, launched in 1995.": "北海道産の本物のバターと塩を使用。1995年に発売された、ビールに最適なおつまみ。",
    
    # Kyoto
    "Premium green tea sweets from Uji, Kyoto's tea capital.": "京都の茶処・宇治の高級抹茶スイーツ",
    "Uji has grown the finest matcha for over 800 years. These sweets capture the rich, slightly bitter taste of authentic matcha.": "宇治は800年以上最高級の抹茶を栽培してきました。この和菓子は本格的な抹茶の豊かでほろ苦い味わいを表現しています。",
    
    # Nagoya
    "Chewy steamed rice cake, Nagoya's traditional wagashi.": "名古屋の伝統和菓子、もちもちの蒸し餅",
    "Made by steaming rice flour dough. Often enjoyed during summer festivals in Nagoya.": "米粉の生地を蒸して作ります。名古屋の夏祭りでよく食べられます。",
    
    # Aomori  
    "Buttery pie filled with sweet Aomori apples.": "青森産の甘いりんごがたっぷり入ったバターパイ",
    "Aomori grows half of Japan's apples! This pie showcases their juicy sweetness with buttery layers.": "青森は日本のりんごの半分を生産！このパイはジューシーな甘さとバター生地の層を表現しています。",
    "Premium dried scallops from Mutsu Bay.": "陸奥湾産の高級干し貝柱",
    "Mutsu Bay's scallops are Japan's finest—sweet and tender. Perfect for rice or soup!": "陸奥湾の帆立貝は日本最高級で甘くて柔らかい。ご飯やスープに最適！",
    
    # Miyagi
    "Mochi topped with sweet edamame paste.": "甘い枝豆ペーストをのせた餅",
    "Zunda is made from fresh edamame, creating a naturally sweet and vibrant green paste unique to Miyagi.": "ずんだは新鮮な枝豆から作られ、宮城独特の自然な甘さと鮮やかな緑色のペーストです。",
    "Fluffy castella cake filled with custard cream.": "カスタードクリームが入ったふわふわのカステラケーキ",
    "Sendai's signature souvenir since 1958, with fluffy sponge and rich custard!": "1958年から続く仙台の名物土産、ふわふわのスポンジと濃厚なカスタード！",
    
    # Akita
    "Famous for rice, sake, and Namahage folklore.": "米、酒、なまはげの伝説で有名",
    "Soybean flour candy sticks, crunchy and sweet.": "きな粉の飴スティック、サクサクして甘い",
    "Made from rice syrup and soy flour, these crunchy sticks are Akita's oldest confection—over 400 years old!": "米飴ときな粉から作られ、このサクサクのスティックは秋田最古のお菓子で400年以上の歴史があります！",
    "Smoked pickled daikon radish, Akita's unique tsukemono.": "燻製した大根の漬物、秋田独特の漬物",
    "Daikon is hung and smoked over hearth fires, then pickled. A winter preservation technique passed down for centuries.": "大根を吊るして囲炉裏の火で燻製し、その後漬けます。何世紀も受け継がれてきた冬の保存技術です。",
    
    # Yamagata
    "Cherry capital and hot spring paradise.": "さくらんぼの都と温泉天国",
    "Premium cherry preserves and sweets.": "高級さくらんぼの砂糖漬けとお菓子",
    "Yamagata produces 70% of Japan's cherries! The famous Sato-nishiki variety is sweet and juicy.": "山形は日本のさくらんぼの70%を生産！有名な佐藤錦は甘くてジューシーです。",
    
    # Fukushima
    "Peach country with beautiful castles and hot springs.": "桃の国、美しい城と温泉",
    "Buttery cookie filled with milk-flavored bean paste.": "ミルク風味の餡が入ったバタークッキー",
    "The combination of Western butter cookie and Japanese anko creates a perfect balance loved across Japan!": "西洋のバタークッキーと日本の餡子の組み合わせが、日本中で愛される完璧なバランスを生み出しています！",
    
    # Ibaraki
    "Natto homeland and agricultural powerhouse.": "納豆の本場と農業大国",
    "Crispy rice crackers flavored with fermented soybeans.": "納豆風味のサクサクせんべい",
    "Natto originated in Ibaraki! These crackers capture the umami without the stickiness.": "納豆は茨城が発祥！このせんべいは粘りなしで旨味を捉えています。",
    
    # Tochigi
    "Home to Nikko shrines and gyoza paradise.": "日光の神社と餃子の楽園",
    "Lemon-flavored milk cookies, Tochigi's cult classic!": "レモン風味のミルククッキー、栃木のカルト的な名物！",
    "These tangy lemon cookies have been made since 1954 and have a devoted fanbase!": "この酸味のあるレモンクッキーは1954年から作られており、熱心なファンがいます！",
    "Premium tofu skin, a Buddhist vegetarian delicacy.": "高級湯葉、仏教の精進料理",
    "Nikko's Buddhist temples perfected yuba-making. The silky skin forms on top of heated soy milk.": "日光の仏教寺院が湯葉作りを完成させました。温めた豆乳の表面にできる絹のような皮です。",
    
    # Gunma
    "Hot spring haven and konnyaku capital.": "温泉の楽園とこんにゃくの都",
    "Grilled steamed buns coated with sweet miso sauce.": "甘い味噌ダレをかけた焼き饅頭",
    "A Gunma street food classic! Steamed buns are skewered and grilled with savory-sweet miso glaze.": "群馬の屋台料理の定番！蒸したまんじゅうを串に刺し、甘じょっぱい味噌ダレで焼きます。",
    "Chewy fruit jellies made from konnyaku root.": "こんにゃく芋から作られたもちもちフルーツゼリー",
    "Konnyaku is Gunma's specialty! These jellies have a unique bouncy texture and come in many fruit flavors.": "こんにゃくは群馬の名物！このゼリーは独特の弾力のある食感で、多くのフルーツ味があります。",
    
    # Saitama
    "Tokyo's neighbor, famous for sweet potato and bonsai.": "東京の隣、さつまいもと盆栽で有名",
    "Soft manju with smooth sweet bean paste filling.": "なめらかな餡が入った柔らかい饅頭",
    
    # Chiba
    "Home to Narita Airport and Tokyo Disneyland.": "成田空港と東京ディズニーランドの本拠地",
    "Buttery cookies filled with peanut cream.": "ピーナッツクリームが入ったバタークッキー",
    "Chiba produces 80% of Japan's peanuts! These cookies showcase the rich, nutty flavor.": "千葉は日本のピーナッツの80%を生産！このクッキーは濃厚なナッツの風味を表現しています。",
    "Moist soy sauce rice crackers, Choshi's specialty.": "しっとりした醤油せんべい、銚子の名物",
    "Choshi is famous for soy sauce! These crackers are brushed with sweet-savory shoyu glaze.": "銚子は醤油で有名！このせんべいは甘じょっぱい醤油ダレを塗っています。",
    
    # Niigata
    "Rice and sake kingdom with heavy snow.": "米と酒の王国、豪雪地帯",
    "Mugwort mochi wrapped in bamboo leaves.": "笹の葉で包んだよもぎ餅",
    "The bamboo leaf wrapping preserves freshness and adds subtle fragrance. A Niigata tradition!": "笹の葉の包装が新鮮さを保ち、微妙な香りを加えます。新潟の伝統です！",
    "Spicy rice crackers with peanuts, Japan's #1 snack!": "ピーナッツ入りの辛いせんべい、日本No.1のスナック！",
    "Created in Niigata in 1966, the spicy-sweet combination became Japan's best-selling rice cracker!": "1966年に新潟で生まれ、辛くて甘い組み合わせが日本で最も売れているせんべいになりました！",
    
    # Toyama
    "Alpine region famous for firefly squid.": "ホタルイカで有名なアルプス地方",
    "Crispy crackers made with Toyama Bay's white shrimp.": "富山湾の白えびで作られたサクサクせんべい",
    "White shrimp from Toyama Bay are translucent jewels of the sea—sweet and delicate!": "富山湾の白えびは海の宝石のように透明で、甘くて繊細です！",
    "Sweet red bean paste wrapped in glutinous rice.": "もち米で包んだ甘い餡",
    "A traditional offering to Toyama's shrines, these rice cakes are soft and chewy!": "富山の神社への伝統的なお供え物、この餅菓子は柔らかくてもちもちです！",
    
    # Ishikawa
    "Kanazawa's gold leaf and seafood paradise.": "金沢の金箔と海の幸の楽園",
    "Sweet red bean cake wrapped in thin crepe.": "薄いクレープで包んだ甘い餡ケーキ",
    "Kanazawa's most popular souvenir! The delicate mochi skin wraps smooth anko inside.": "金沢で最も人気のあるお土産！繊細な餅の皮の中になめらかな餡を包んでいます。",
    "Premium sake with edible gold flakes.": "食用金箔入りの高級日本酒",
    "Kanazawa produces 99% of Japan's gold leaf! Adding it to sake brings luxury and good fortune.": "金沢は日本の金箔の99%を生産！日本酒に加えると豪華さと幸運をもたらします。",
    
    # Fukui
    "Dinosaur fossils and Echizen crab country.": "恐竜の化石と越前ガニの国",
    "Ultra-soft mochi wrapped around sweet bean paste.": "甘い餡を包んだ超柔らかい餅",
    "Fukui's signature souvenir—the mochi is so soft it melts in your mouth!": "福井の代表的なお土産—餅が柔らかすぎて口の中で溶けます！",
    "Buckwheat noodles with grated daikon, take-home kit.": "大根おろし付きのそば、お持ち帰りキット",
    "Echizen soba is served on lacquerware with grated daikon and dashi—a Fukui tradition!": "越前そばは漆器に盛られ、大根おろしと出汁で提供されます—福井の伝統です！",
    
    # Yamanashi
    "Mt. Fuji's home and grape/wine capital.": "富士山の本拠地とぶどう/ワインの都",
    "Kinako-dusted mochi with kuromitsu syrup.": "きな粉をまぶした餅、黒蜜シロップ付き",
    "This traditional sweet pairs chewy mochi with nutty soy powder and rich black sugar syrup!": "この伝統的な和菓子は、もちもちの餅とナッツのようなきな粉、濃厚な黒蜜シロップを組み合わせています！",
    "Buttery cookies infused with Yamanashi wine.": "山梨産ワインを練り込んだバタークッキー",
    "Yamanashi is Japan's wine capital! These cookies capture the fruity aroma of local grapes.": "山梨は日本のワインの都！このクッキーは地元のぶどうのフルーティーな香りを捉えています。",
    
    # Nagano
    "Alpine wonderland with apples and soba.": "りんごとそばのアルプスの楽園",
    "Grilled dumplings filled with vegetables or anko.": "野菜や餡が入った焼き団子",
    "Nozawana (pickled greens) or sweet anko fillings! Skewered and grilled with miso—perfect for cold mountain winters.": "野沢菜（漬物）または甘い餡の詰め物！味噌で串焼きにして、寒い山の冬にぴったりです。",
    "Chestnut paste sweets from Obuse town.": "小布施町の栗ペースト和菓子",
    "Obuse's chestnuts are legendary! These sweets contain pure chestnut paste—rich and luxurious.": "小布施の栗は伝説的です！この和菓子には純粋な栗ペーストが入っており、濃厚で豪華です。",
    
    # Gifu
    "Cormorant fishing and Hida beef land.": "鵜飼いと飛騨牛の土地",
    "Pure chestnut paste shaped like chestnuts.": "栗の形をした純粋な栗ペースト",
    "Nakatsugawa's chestnuts are Japan's finest! These contain nothing but chestnut—no sugar or additives.": "中津川の栗は日本最高級！これには栗以外何も含まれていません—砂糖も添加物もありません。",
    "Sweetfish-shaped sponge cake filled with custard.": "鮎の形をしたカスタード入りスポンジケーキ",
    "Shaped like the ayu fish caught in Nagara River! The mochi outer layer makes it unique.": "長良川で獲れる鮎の形！外側の餅の層が独特です。",
    
    # Shizuoka
    "Mt. Fuji, green tea, and eel paradise.": "富士山、緑茶、うなぎの楽園",
    "Crispy eel-flavored pastry, Hamamatsu's icon.": "うなぎ風味のサクサクパイ、浜松の象徴",
    "Hamamatsu is famous for eel! These light pastries are shaped like eels and capture their savory taste.": "浜松はうなぎで有名！この軽いパイはうなぎの形をしており、香ばしい味を捉えています。",
    "Premium matcha cookies and chocolates.": "高級抹茶クッキーとチョコレート",
    "Shizuoka produces 40% of Japan's green tea! These sweets showcase the pure, vibrant taste.": "静岡は日本の緑茶の40%を生産！この和菓子は純粋で鮮やかな味わいを表現しています。",
}

# Replace all translations
for eng, jpn in translations.items():
    # Escape special regex characters in the English text
    eng_escaped = re.escape(eng)
    content = re.sub(eng_escaped, jpn, content)

# Write back
with open('src/data/omiyageData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Converted all specialty descriptions to Japanese!')
print(f'✅ Translated {len(translations)} descriptions')
