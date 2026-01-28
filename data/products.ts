export type Product = {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  details: string[]
  rating: number
  stock: number
}

export const products: Product[] = [
 /* LACTEOS - ALPURA */

{
  id: "LECH-LACT-201",
  name: "Leche deslactosada 1.5 LT",
  price: 46.50,
  category: "Lacteos",
  image: "/demo/LECHE_1.5_LT.png",
  description: "Leche deslactosada ideal para consumo diario.",
  details: [
    "Marca: Alpura",
    "Presentación: C/6",
    "Contenido: 1.5 LT"
  ],
  rating: 4.6,
  stock: 50,
},
{
  id: "LECH-LACT-202",
  name: "Leche clásica 1.5 LT",
  price: 49.00,
  category: "Lacteos",
  image: "/demo/LECHE_CLASICA_1.5_LT.png",
  description: "Leche clásica de alta calidad para toda la familia.",
  details: [
    "Marca: Alpura",
    "Presentación: C/6",
    "Contenido: 1.5 LT"
  ],
  rating: 4.6,
  stock: 40,
},
{
  id: "LECH-LACT-203",
  name: "Media crema 250 ML",
  price: 13.00,
  category: "Lacteos",
  image: "/demo/Media Crema alpura 250ML.png",
  description: "Media crema ideal para cocina y repostería.",
  details: [
    "Marca: Alpura",
    "Presentación: C/27",
    "Contenido: 250 ML"
  ],
  rating: 4.5,
  stock: 30,
},
{
  id: "LECH-LACT-204",
  name: "Leche sabor chocolate 200 ML",
  price: 9.50,
  category: "Lacteos",
  image: "/demo/leche_chocolate_200_ml.png",
  description: "Leche sabor chocolate lista para beber.",
  details: [
    "Marca: Alpura",
    "Presentación: C/24",
    "Contenido: 200 ML"
  ],
  rating: 4.7,
  stock: 35,
},
{
  id: "LECH-LACT-205",
  name: "Leche sabor fresa 200 ML",
  price: 9.50,
  category: "Lacteos",
  image: "/demo/leche_fresa_200_ml.png",
  description: "Leche sabor fresa ideal para niños y jóvenes.",
  details: [
    "Marca: Alpura",
    "Presentación: C/24",
    "Contenido: 200 ML"
  ],
  rating: 4.7,
  stock: 30,
},
{
  id: "LECH-LACT-206",
  name: "Leche clásica 200 ML",
  price: 8.50,
  category: "Lacteos",
  image: "/demo/leche_clasica_200_ml.png",
  description: "Leche clásica en presentación individual.",
  details: [
    "Marca: Alpura",
    "Presentación: C/24",
    "Contenido: 200 ML"
  ],
  rating: 4.5,
  stock: 40,
},
{
  id: "LECH-LACT-207",
  name: "Leche deslactosada 200 ML",
  price: 8.50,
  category: "Lacteos",
  image: "/demo/leche_deslactosada_200_ml.png",
  description: "Leche deslactosada en presentación individual.",
  details: [
    "Marca: Alpura",
    "Presentación: C/24",
    "Contenido: 200 ML"
  ],
  rating: 4.5,
  stock: 25,
},
{
  id: "LECH-LACT-208",
  name: "Leche light 1 LT",
  price: 28.00,
  category: "Lacteos",
  image: "/demo/leche_light_1_lt.png",
  description: "Leche light baja en grasa.",
  details: [
    "Marca: Alpura",
    "Presentación: C/12",
    "Contenido: 1 LT"
  ],
  rating: 4.4,
  stock: 30,
},
{
  id: "LECH-LACT-209",
  name: "Leche LACDEL 1 LT",
  price: 26.00,
  category: "Lacteos",
  image: "/demo/leche_lacdel_1_lt.png",
  description: "Leche económica para consumo diario.",
  details: [
    "Marca: Alpura",
    "Presentación: C/12",
    "Contenido: 1 LT"
  ],
  rating: 4.3,
  stock: 20,
},
{
  id: "LECH-LACT-210",
  name: "Leche PRO 1 LT",
  price: 39.00,
  category: "Lacteos",
  image: "/demo/leche_pro_1_lt.png",
  description: "Leche alta en proteína.",
  details: [
    "Marca: Alpura",
    "Presentación: C/12",
    "Contenido: 1 LT"
  ],
  rating: 4.7,
  stock: 25,
},
{
  id: "LECH-LACT-211",
  name: "Leche clásica 1 LT",
  price: 28.00,
  category: "Lacteos",
  image: "/demo/leche_clasica_1_lt.png",
  description: "Leche clásica en presentación familiar.",
  details: [
    "Marca: Alpura",
    "Presentación: C/12",
    "Contenido: 1 LT"
  ],
  rating: 4.6,
  stock: 40,
},
{
  id: "JUGO-LACT-212",
  name: "Jugo del Valle 200 ML",
  price: 7.00,
  category: "Lacteos",
  image: "/demo/jugo_del_valle_200_ml.png",
  description: "Jugo individual ideal para lunch.",
  details: [
    "Marca: Del Valle",
    "Presentación: C/27",
    "Contenido: 200 ML"
  ],
  rating: 4.4,
  stock: 60,
},
{
  id: "LECH-LACT-213",
  name: "Leche deslactosada light 1 LT",
  price: 32.50,
  category: "Lacteos",
  image: "/demo/leche_deslactosada_light_1_lt.png",
  description: "Leche deslactosada light baja en grasa.",
  details: [
    "Marca: Alpura",
    "Presentación: C/6",
    "Contenido: 1 LT"
  ],
  rating: 4.6,
  stock: 35,
},
{
  id: "LECH-LACT-214",
  name: "Leche deslactosada 0% grasa 1 LT",
  price: 35.00,
  category: "Lacteos",
  image: "/demo/leche_deslactosada_0_grasa_1_lt.png",
  description: "Leche deslactosada sin grasa.",
  details: [
    "Marca: Alpura",
    "Presentación: C/6",
    "Contenido: 1 LT"
  ],
  rating: 4.7,
  stock: 30,
},

]
