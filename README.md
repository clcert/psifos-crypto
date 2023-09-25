# psifos-crypto
Repositorio dedicado a la crypto que se utiliza en Psifos

## Como usar
La crypto se divide en dos. Por un lado tenemos la del frontend que se necesita ejecutar en un ambiente web, por otro lado se tiene la del backend que funciona con Python.

### Frontend
Para esto se necesita de un ambiente web. Se recomienda utilizar http-server el cual para instalarlo se requiere de Node y ejecutar el comando `npm install -g http-server`. Para iniciarlo ejecutar `http-server`.
Dentro de la carpeta frontend se encuentran los html `encrypt.html` y `decryptions.html` con sus respectivos archivos javascript. Dentro de los JS se colocan las variables necesarias. Al abrir la pagina se ejecutara el script y se mostrara el resultado en pantalla y se descargara un archivo con la información.

### Backend
Para ejecutar el script se debe escribir `python main.py <variable>` donde variable puede ser `tally` para calcular el tally o `decrypt` para combinar desencriptaciones.
