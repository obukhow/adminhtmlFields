# UX-скрипт для админки мадженто

Правила построения хороших интерфейсов, требуют создания прозрачных и понятных для пользователя форм. Интерфейс должен мгновенно реагировать на все изменения, сделаные оператором. При этом все данные, которые компьютер может заполнить сам, должны заполнятся автоматически, оставляя пользователю возможность их изменять.
Данный скрипт позволяет приблизится к реализации данных требований, позволяя мгновенно отображать изменения сделанные пользователем в названии редактируемого объекта, а так же автоматически заполняя поля, которые, зачастую, являются лишь транслитерированной версией уже введённых данных.
При этом урл-кей или любой системный код формируется прозрачно для пользователя, демонстрируя принцип преобразований в реальном времени, и позволяет при желании изменить сгенерированные данные.

![Demo](http://i.imgur.com/I6F49V6.gif)

##Устновка

1. Копируем предложенные файлы в папку `js/oggetto/adminhtml`.
2. Подключаем скрипты на страницу редактирования сущности через лэйаут

```xml
<adminhtml_entity_edit>
        <reference name="head">
            <action method="addJs"><file>oggetto/adminhtml/transliterate.js</file></action>
            <action method="addJs"><file>oggetto/adminhtml/fieldUpdater.js</file></action>
        </reference>
<adminhtml_entity_edit>
```

3. В блоке контейнере формы добавляем в заголовки плейсхолдеры для замены, и вызываем скрипты


```php
class MyCompany_MyModule_Block_Adminhtml_Entity_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{
    /**
     * Init grid container
     */
    public function __construct()
    {
        $entity = Mage::registry('current_entity');
        $headerText = $entity->getId() ?
            $this->__('Edit Entity <span class="myClass">%s</span>', $entity->getName()) :
            $this->__('Add Entity <span class="myClass">%s</span>', $this->__('New'));
        $this->_headerText = $headerText;

        parent::__construct();
        $this->_formInitScripts[] = "document.observe('dom:loaded', function() {" .
            "new titleFieldUpdater('name', 'myClass');" .
            "new fieldTransliterator('name', 'url_key');" .
            "});";
        ;
 
    }
```

## Исользование

### Обновление заголовков при изменении имени сущности

Для использования данного функционала нужно создать новый экземпляр объекта `titleFieldUpdater`

```javascript
new titleFieldUpdater(sourceId, className, updateTitleFlag);
```
Параметры:

* `sourceId` — идентификатор текстового поля для ввода имени (источник данных)
* `className` – название класса элементов, в которые необходимо копировать данные из источника. Указанный класс можно присвоить произвольному количеству элементов. При обновлении текстового поля источника, значения во всех элементах с данным классом будут обновлены.
* `updateTitleFlag` — флаг определяющий, нужно ли обновлять заголовок страницы (текст берется из заголовка третьего уровня на странице)

### Транслитерация значения поля и копирование в другие поля

Для использования данного функционала нужно создать новый экземпляр объекта `fieldTransliterator`

```javascript
new fieldTransliterator(sourceId, targetField1, targetField2, ...);
```
Параметры:

* `sourceId` — идентификатор текстового поля источника данных
* `targetField1…N` – идентификаторы полей, в которые будут копироваться транслированные данные
