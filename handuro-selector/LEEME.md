# Asistente Handuro

Abrir `index.html` en un navegador, o ejecutar `node server.cjs` desde esta carpeta y visitar http://127.0.0.1:8765.

## Catálogo

Se incorporaron las ocho fichas de la categoría AC/DC indicada por el usuario, consultadas el 5 de octubre de 2026: 199 filas de modelos numeradas 150–348. No se incluyen las categorías DC solamente, superficie, piscina o aguas residuales.

Las fichas originales están en `sources/`, con su URL en `sources/manifest.json`. `catalog-data.json` conserva los modelos, potencia de tabla, máximos, número de curva y 1208 puntos leídos visualmente de los gráficos. `build-catalog.cjs` documenta cada lectura y genera los datos consumidos por la app.

Los puntos son aproximaciones redondeadas de imágenes, no tablas numéricas ni curvas certificadas del fabricante. No se extrapola fuera del intervalo transcrito. La banda de revisión max(5 m, 5% de Hmáx) es un criterio de interfaz; no es una cota demostrada del error de lectura ni una tolerancia de la bomba. Las condiciones de ensayo y los rangos recomendados de operación no están declarados en esas láminas. No se interpreta el código de tensión como especificación de conexionado ni se dimensionan paneles a partir de las columnas comerciales.

La preselección indica que la curva aproximada tiene altura suficiente al caudal pedido; no es el punto real de intersección con la instalación ni garantiza volumen solar diario. Verificar rango de operación, variación de nivel dinámico, refrigeración, calidad de agua, dimensiones físicas, controlador, alimentación y producción solar del mes crítico.

Los modelos 291 y 294 tienen una discrepancia de origen: denominación con 22 pero Qmáx de tabla de 23 m³/h; ambos datos se preservan. Las curvas no se generaron uniendo máximos de tabla.

## Disponibilidad y persistencia

Todos los modelos comienzan sin stock confirmado. Se pueden marcar disponibles o no disponibles y filtrar. La disponibilidad, el último proyecto y las curvas personales se guardan en el almacenamiento del navegador, separado del catálogo incorporado. Abrir por archivo o por localhost usa almacenamientos distintos. No hay servidor remoto ni sincronización de stock.

## Comprobaciones

`node check.cjs` comprueba cálculo hidráulico e interpolación. `node catalog-check.cjs` comprueba integridad del catálogo y sus fuentes, numeración, orden de puntos y ausencia de extrapolación. Estos controles no certifican la precisión de la lectura gráfica.
