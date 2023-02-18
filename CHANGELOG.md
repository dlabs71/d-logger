# Список изменений

Все существенные изменения в проекте будут задокументированы в этом файле.
Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), 
и этот проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [2.0.0] - 2023-02-18

### Мажорные изменения

- Из проекта удалён FileAppender и всё что с ним было связанно. Всё это вынесено в отдельный
  проект [**@dlabs71/d-logger-node**](https://github.com/dlabs71/d-logger-node#readme).
- Vue.js плагин `DLoggerPlugin` убран из экспорта по умолчанию и перенесён в именованный экспорт

### Добавлено

- Параметр `dateL10n` в конфигурацию логгера и аппендеров. Указывает локализацию для даты печатаемой в выводе журнала
  логирования
- Добавлен экспорт константы уровня логирования `LOG_LEVEL`

### Удалено

- Удалён класс `FileAppender`
- Удалены следующие функции класса `DLogger`
    - function addFileAppender
    - function getFileAppenders
    - function existFileAppender
    - function deleteAllFileLogs