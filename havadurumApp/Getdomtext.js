

export const Getdomtext = (styleName) => {
    switch (styleName.toLowerCase()) {
        case "minimalist":
            return "Az ama öz! Minimalist stilin sana sade, zarif ve net bir duruş kazandırıyor. Renk seçimlerin ve keskin hatlar seni dengeli bir karakter gibi gösteriyor 🎯";

        case "sportif":
            return "Hareketli ve enerjik! Sportif stilin, özgüvenli ve dinamik biri olduğunun sinyalini veriyor. Rahatlığı seviyorsun ama tarzdan ödün vermiyorsun 🏃‍♂️👟";

        case "vintage":
            return "Geçmişe göz kırpan bir ruh! Vintage stilin nostaljiyle harmanlanmış, detaylara önem veren ve kendine özgü bir bakış açın olduğunu gösteriyor 📼🌷";

        case "bohem":
            return "Özgürlük senin ilhamın! Bohem stilin seni doğayla uyumlu, özgün ve duygusal bir karakter haline getiriyor. Katmanlı kumaşlar, ruhunun akışına ayak uyduruyor 🧘‍♀️🌻";

        case "casual":
            return "Rahatlık senin tanımın! Casual seçimlerin seni doğal, samimi ve gündelik yaşamda uyumlu biri yapıyor. Her an hazır ve zahmetsizce şık görünüyorsun 👕☕";

        case "cool/urban":
            return "Şehirli bir duruş! Cool/Urban stil, modern çizgilerle karizmatik ve kendinden emin bir görünüm sunuyor. Tarzın sokakları yansıtıyor 🏙️🕶️";

        case "şık/elegant":
            return "Zarafet sende doğal! Elegant seçimlerin detaylara verdiğin önemi ve rafine zevkini gösteriyor. Senin için stil bir duruş biçimi 👗✨";

        case "renkli/fun":
            return "Hayat seninle renkleniyor! Renkli/Fun stilin seni enerjik, neşeli ve pozitif biri yapıyor. Her kombinde bir doz mutluluk taşıyorsun 🌈🎉";

        default:
            return "Öne çıkan baskın bir stil yok gibi görünüyor. Kombin seçimlerine devam ettikçe karakterin şekillenmeye başlayacak 👟🧥";
    }
}