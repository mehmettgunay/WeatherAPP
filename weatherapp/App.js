import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image } from 'react-native';

const API_KEY = '210a290c2c305ed95ba41bde5f593300';

const sehirZipKodlari = {
  "10000": "Balikesir",
  "11000": "Bilecik",
  "12000": "Bingol",
  "13000": "Bitlis",
  "14000": "Bolu",
  "15000": "Burdur",
  "16000": "Bursa",
  "17000": "Canakkale",
  "18000": "Cankiri",
  "19000": "Corum",
  "20000": "Denizli",
  "21000": "Diyarbakir",
  "22000": "Edirne",
  "23000": "Elazig",
  "24000": "Erzincan",
  "25000": "Erzurum",
  "26000": "Eskisehir",
  "27000": "Gaziantep",
  "28000": "Giresun",
  "29000": "Gumushane",
  "30000": "Hakkari",
  "31000": "Hatay",
  "32000": "Isparta",
  "33000": "Mersin",
  "34000": "Istanbul",
  "35000": "Izmir",
  "36000": "Kars",
  "37000": "Kastamonu",
  "38000": "Kayseri",
  "39000": "Kirklareli",
  "40000": "Kirsehir",
  "41000": "Kocaeli",
  "42000": "Konya",
  "43000": "Kutahya",
  "44000": "Malatya",
  "45000": "Manisa",
  "46000": "Kahramanmaras",
  "47000": "Mardin",
  "48000": "Mugla",
  "49000": "Mus",
  "50000": "Nevsehir",
  "51000": "Nigde",
  "52000": "Ordu",
  "53000": "Rize",
  "54000": "Sakarya",
  "55000": "Samsun",
  "56000": "Siirt",
  "57000": "Sinop",
  "58000": "Sivas",
  "59000": "Tekirdag",
  "60000": "Tokat",
  "61000": "Trabzon",
  "62000": "Tunceli",
  "63000": "Sanliurfa",
  "64000": "Usak",
  "65000": "Van",
  "66000": "Yozgat",
  "67000": "Zonguldak",
  "68000": "Aksaray",
  "69000": "Bayburt",
  "70000": "Karaman",
  "71000": "Kirikkale",
  "72000": "Batman",
  "73000": "Sirnak",
  "74000": "Bartin",
  "75000": "Ardahan",
  "76000": "Igdir",
  "77000": "Yalova",
  "78000": "Karabuk",
  "79000": "Kilis",
  "80000": "Osmaniye",
  "81000": "Duzce",
  "01000": "Adana",
  "02000": "Adiyaman",
  "03000": "Afyonkarahisar",
  "04000": "Agri",
  "05000": "Amasya",
  "06000": "Ankara",
  "07000": "Antalya",
  "08000": "Artvin",
  "09000": "Aydin",
};

const App = () => {
  const [postaKodlari, setPostaKodlari] = useState(['', '', '', '', '', '']);
  const [havaDurumuVerileri, setHavaDurumuVerileri] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const havaDurumunuGetir = async () => {
    setYukleniyor(true);
    setHavaDurumuVerileri([]);

    const girilenPostaKodlari = postaKodlari.filter((postaKodu) => postaKodu !== '');

    if (girilenPostaKodlari.length === 0) {
      alert("Lütfen en az bir posta kodu giriniz.");
      setYukleniyor(false);
      return;
    }

    try {
      const yanitlar = await Promise.all(
        girilenPostaKodlari.map(async (postaKodu) => {
          let url = `https://api.openweathermap.org/data/2.5/weather?zip=${postaKodu},tr&appid=${API_KEY}&units=metric`;

          if (sehirZipKodlari[postaKodu]) {
            const sehirAdi = sehirZipKodlari[postaKodu];
            url = `https://api.openweathermap.org/data/2.5/weather?q=${sehirAdi},tr&appid=${API_KEY}&units=metric`;
          }

          const yanit = await fetch(url);

          if (yanit.ok) {
            const veri = await yanit.json();
            return {
              postaKodu,
              veri,
            };
          } else {
            return null;
          }
        })
      );
      setHavaDurumuVerileri(yanitlar.filter((yanit) => yanit !== null));
    } catch (hata) {
      console.error('Hava durumu verisi alınırken hata oluştu: ', hata);
    }
    setYukleniyor(false);
  };

  const postaKoduDegistir = (index, deger) => {
    const yeniPostaKodlari = [...postaKodlari];
    yeniPostaKodlari[index] = deger;
    setPostaKodlari(yeniPostaKodlari);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Hava Durumu Uygulaması</Text>

      {postaKodlari.map((postaKodu, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Posta Kodu ${index + 1} Giriniz`}
          keyboardType="numeric"
          value={postaKodu}
          onChangeText={(text) => postaKoduDegistir(index, text)}
        />
      ))}

      <Button title="Hava Durumunu Getir" onPress={havaDurumunuGetir} />

      {yukleniyor ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <FlatList
          data={havaDurumuVerileri}
          keyExtractor={(item) => item.postaKodu}
          renderItem={({ item }) => (
            <View style={styles.havaDurumuKart}>
              <Text style={styles.postaKoduYazi}>Posta Kodu: {item.postaKodu}</Text>
              <Text style={styles.konumYazi}>Konum: {item.veri.name}</Text>
              <Text style={styles.sicaklikYazi}>Sıcaklık: {item.veri.main.temp} °C</Text>
              <Text style={styles.durumYazi}>Durum: {item.veri.weather[0].description}</Text>

              <Image
                style={styles.icon}
                source={{
                  uri: `http://openweathermap.org/img/wn/${item.veri.weather[0].icon}@2x.png`,
                }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  havaDurumuKart: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    alignItems: 'center',
  },
  postaKoduYazi: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  konumYazi: {
    fontSize: 16,
  },
  sicaklikYazi: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  durumYazi: {
    fontSize: 14,
  },
  icon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default App;
