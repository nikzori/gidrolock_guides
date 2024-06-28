# ZigBee2MQTT: файлы конфигурации
Файлы расширения для ZigBee2MQTT; для поддержки устройства необходим только один из файлов. 
Поместите файл в папку `/data.` В файле `configuration.yaml` добавьте следущее:


## Winner_ZigBee_Basic.js
Базовая поддержка для Winner'а. Доступные данные:
- Положение крана (открыт/закрыт)
- Статус тревоги
-- Из-за особенностей прошивки, тревогу можно только выключить.
- Статус режима уборки
- Уровень заряда баттареи
- Код ошибки

## Winner_ZigBee_dev.js
Такой же функционал, как и у базовой версии.
Файл с полным списком всех DP устройства. Дополнительные DP не будут работать с Z2MQTT из-за их нестандартного использования: необходимо расширять библиотеки z2mqtt для корректной обработки данных.

Например, DP sensor_* — это 4-байтовое целое число:
0xAA_AA_BB_CC , где:
[AA_AA] - битовые флаги
[BB]    - уровень сигнала
[CC]    - уровень заряда баттареи