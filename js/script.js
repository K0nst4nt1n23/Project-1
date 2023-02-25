"use strict"
//===код для определения типа устройства===========================================================
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BleckBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};
//=================================================================================================
//добавляем модификатор в зависимости от типа устройства
if (isMobile.any()) {
    document.body.classList.add('_touch');
} else {
    document.body.classList.add('_pc');
};
//=================================================================================================


//===Меню бургер ==================================================================================
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
    iconMenu.addEventListener('click', function(e){
        document.body.classList.toggle('_lock'); //для отключения скролла при открытом бургере
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
};
//=================================================================================================

//===Закрытие бургера при клике по пункту меню (переделано из Прокрутка при клике)=================
const menuLinks = document.querySelectorAll('.menu__link');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLinks => {
        menuLinks.addEventListener("click", onMenuLinksClick);
    });

    function onMenuLinksClick(e) {
        const menuLink = e.target;
        if (iconMenu.classList.contains('_active')) {
            document.body.classList.remove('_lock');
            iconMenu.classList.remove('_active');
            menuBody.classList.remove('_active');
        }
    }
};
//=================================================================================================


// Адаптивность картинок ==========================================================================
function _ibg(){

    let _ibg = document.querySelectorAll("._ibg");
    for (var i = 0; i < _ibg.length; i++) {
        if (_ibg[i].querySelector('img')) {
            _ibg[i].style.backgroundImage = 'url(' + _ibg[i].querySelector('img').getAttribute('src') + ')';
        }
    }
}
    _ibg();
//=================================================================================================


//===Spollers======================================================================================
//получаем коллекцию всех объектов у которых есть датаатребут data-spollers
const spollersArray = document.querySelectorAll('[data-spollers]');
//делаем проверку на наличие таких объектов получаем (которые имеют датаатребут data-spollers)
if (spollersArray.length > 0) {
    //разделяем коллекцию на два массива: 1й - спойлеры без условия (первые 3шт); 2й - спойлеры с условиями (вторые 3шт которые включаются в зависимости от ширины экрана)
    // Получаем массив ОБЫЧНЫХ спойлеров:
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) { //для начала переводим коллекцию spollersArray в массив с помощью Array.from(spollersArray) для возможности работать методом filter который работает только с массивами
        return !item.dataset.spollers.split(",")[0]; //условие метода - отбираем элементы у которых датаспойлер не имеет параметров
        /*алгоритм проверки: обращаемся к элементу массива !item, заходим в его датаатрибуты dataset, обращаемся к конкретному датаатребуту spollers
        и с помощью split пытаемся разделить содержимое и преобразовать в массив с разделением "," и сразу запрашиваем первый элемент этого массива с нулевым индексом[0]
        и с помощью !(оператор НЕ) получаем true когда этого параметра нет (тоесть получаем true когда у нашего массива нет ни одного элемента (массив пуст []))
        */
        
    });
    //проверка на наличие таких спойлеров (ОБЫЧНЫХ) и инициализация (запуск) спойлеров
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular); //функция которая срабатывает в случае успешной проверки. (функция написана дальше)
    }
    // Получаем массив спойлеров С ПАРАМЕТРАМИ (те которые работают в зависимости от ширины экрана):
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0]; //условие метода ПРОТИВОПОЛОЖНЫ условиям для spollersRegular
        /*
        мы получим true когда у нашего датаатрибута есть параметр. проверка аналогична spollersRegular но отличается 
        тем что отсутствует !(оператор НЕ) перед item. (тоесть получаем true когда у нашего массива есть хоть один элемента (массив НЕ пуст [div.block.block_1, div.block.block_2, div.block.block_3]))
        */
    });
    //проверка на наличие таких спойлеров (С ПАРАМЕТРАМИ) и инициализация (запуск) спойлеров
    if (spollersMedia.length > 0) {
        const breakpointsArray = []; //создаем пустой массив который будем наполнять параметрами
        spollersMedia.forEach(item => { //перебераем массив объектов с медиазапроссами (С ПАРАМЕТРАМИ) spollersMedia
            const params = item.dataset.spollers; //получаем строку с параметрами для каждого объекта
            const breakpoint = {}; // создаем пустой объект который будем наполнять
            const paramsArray = params.split(","); // с помощью split преобразовываем строку внутри params в массив с разделителем ","
            breakpoint.value = paramsArray[0]; //для пустого объекта breakpoint создаем значение value и присваиваем ему нулевую ячейку массива paramsArray[0] (теперь breakpoint.value = 650, а breakpoint.type = min), если мы не указали в датаатребуте min то по умолчанию будет max (? paramsArray[1].trim() : "max")
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item; // breakpoint.item присваиваем сам объект item
            breakpointsArray.push(breakpoint); // и все описанное выше добавляем в массив breakpointsArray
        });
        // получаем уникальные брейкпоинты для корректной работы когда несколько блоков со спойлерами имеют одинаковые условия (холтый и розовый блоки имеют одинаковое условие <=800px)
        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type; // в итоге получаем (min-width: 650px),650,min - пример
        });
        mediaQueries = mediaQueries.filter(function (item, index, self) { //все что получили выше присваиваем переменной mediaQuerie и с помощью метода массива filter мы возвращаем уникальные значения (это значит что после работы filter внутри массива будут только уникальные значения - без повторов)
            return self.indexOf(item) === index;
        });
        // работаем с каждым брейкпоинтом. пробегаемся по всем брейкпоинтам которые мы собрали в mediaQueries
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(","); //получаем строку и преобразовываю ее с массив с помощью ","
            const mediaBreakpoint = paramsArray[1]; // получаем 1й параметр (это у нас только число (650))
            const mediaType = paramsArray[2]; // получаем 2й параметр (это у нас min или max)
            const matchMedia = window.matchMedia(paramsArray[0]); // matchMedia метод который слушает ширину экрана и отрабатывает если сработал тот или иной брейкпоинт
            
            // Объекты с нужными условиями. Собираем массив объектов которые соответствуют условиям
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) { //условия (mediaBreakpoint - равен 650 или 800 или какое мы указали, mediaType - min или max)
                    return true; //если все условия выполнены значит получаем true
                }
            });
            // Событие. Создаем событие которое будет отрабатывать при выполнении условия (true)
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia); //передаем в функцию собранные массив объектов которые соответствуют брейкпоинту и саму константу matchMedia
            });
            initSpollers(spollersArray, matchMedia); //запускаем эту функцию что бы она отработала сразу при загрузке страницы 
        });
    }

    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) { //в функцию получаем массив объектов с которыми нужно работать и константу
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        });
    }

    // Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitle = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitle.length > 0) {
            spollerTitle.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) { //_active - нужен для возможности загрузки сайта с уже открытым спойлером (любым)
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollerBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }
    function hideSpollerBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
};
//=================================================================================================
//SlideTaggle
let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			// Створюємо подію 
			document.dispatchEvent(new CustomEvent("slideUpDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty('height') : null;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
            // Створюємо подію
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target: target
                }
            }));
        }, duration);
    }
}
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}
//=================================================================================================


// Слайдер (Swiper) ===============================================================================
// Инициализируем Swiper
new Swiper('.customers-slider', {
    // Стрелки
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    // Навигация
    // Буллеты, текущее положение, прогрессбар
    pagination: {
        el: '.swiper-pagination',
        // Буллеты
        clickable: true,
        // Динамические буллеты
        dynamicBullets: true,
        /*
        // Кастомные буллеты (нужно отключить Динамические буллеты или увеличить размер буллетов)
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
        */
        // Прогрессбар
        //type: 'progressbar',
    },
    // Управление клавиатурой
    keyboard: {
        // Включить/Выключить
        enabled: true,
    },
    // Автовысота
    //autoHeight: true,
});
//=================================================================================================