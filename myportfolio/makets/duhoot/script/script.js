/*
**	Author: Vladimir Shevchenko
**	URI: http://www.howtomake.com.ua/2012/stilizaciya-vsex-elementov-form-s-pomoshhyu-css-i-jquery.html 
*/


// Select
$('.slct_d').click(function(){
	/* Заносим выпадающий список в переменную */
	var dropBlock = $(this).parent().find('.drop_d');
	
	/* Делаем проверку: Если выпадающий блок скрыт то делаем его видимым*/
	if( dropBlock.is(':hidden') ) {
		dropBlock.slideDown();
		
		/* Выделяем ссылку открывающую select */
		$(this).addClass('active');

		
		/* Работаем с событием клика по элементам выпадающего списка */
		$('.drop_d').find('.did').click(function(){
			
			/* Заносим в переменную HTML код элемента 
			списка по которому кликнули */
			var selectResult_ed = $(this).html();
			
			/* Находим наш скрытый инпут и передаем в него 
			значение из переменной selectResult */
			$(this).parent().parent().find('.educat input').val(selectResult_ed);
			
			/* Передаем значение переменной selectResult в ссылку которая 
			открывает наш выпадающий список и удаляем активность */
			$('.slct_d').removeClass('active').html(selectResult_ed),
			
			/* Скрываем выпадающий блок */
			dropBlock.slideUp();
		});
			
		/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
		} else {
			$(this).removeClass('active');
			dropBlock.slideUp();
		}
		
		/* Предотвращаем обычное поведение ссылки при клике */
		return false;
	});	
	// Select
	$('.slct_e').click(function(){
		/* Заносим выпадающий список в переменную */
		var dropBlock = $(this).parent().find('.drop_e');
		
		/* Делаем проверку: Если выпадающий блок скрыт то делаем его видимым*/
		if( dropBlock.is(':hidden') ) {
			dropBlock.slideDown();
			
			/* Выделяем ссылку открывающую select */
			$(this).addClass('active');
			
			/* Работаем с событием клика по элементам выпадающего списка */
			$('.drop_e').find('.die').click(function(){
				
				/* Заносим в переменную HTML код элемента 
				списка по которому кликнули */
				var selectResult_ed = $(this).html();
				
				/* Находим наш скрытый инпут и передаем в него 
				значение из переменной selectResult */
				$(this).parent().parent().find('.educat input').val(selectResult_ed);
				
				/* Передаем значение переменной selectResult в ссылку которая 
				открывает наш выпадающий список и удаляем активность */
				$('.slct_e').removeClass('active').html(selectResult_ed);
				
				/* Скрываем выпадающий блок */
				dropBlock.slideUp();
			});
			
		/* Продолжаем проверку: Если выпадающий блок не скрыт то скрываем его */
		} else {
			$(this).removeClass('active');
			dropBlock.slideUp();
		}
		
		/* Предотвращаем обычное поведение ссылки при клике */
		return false;
	});	
		
		

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKipcdEF1dGhvcjogVmxhZGltaXIgU2hldmNoZW5rb1xyXG4qKlx0VVJJOiBodHRwOi8vd3d3Lmhvd3RvbWFrZS5jb20udWEvMjAxMi9zdGlsaXphY2l5YS12c2V4LWVsZW1lbnRvdi1mb3JtLXMtcG9tb3NoaHl1LWNzcy1pLWpxdWVyeS5odG1sIFxyXG4qL1xyXG5cclxuXHJcbi8vIFNlbGVjdFxyXG4kKCcuc2xjdF9kJykuY2xpY2soZnVuY3Rpb24oKXtcclxuXHQvKiDQl9Cw0L3QvtGB0LjQvCDQstGL0L/QsNC00LDRjtGJ0LjQuSDRgdC/0LjRgdC+0Log0LIg0L/QtdGA0LXQvNC10L3QvdGD0Y4gKi9cclxuXHR2YXIgZHJvcEJsb2NrID0gJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuZHJvcF9kJyk7XHJcblx0XHJcblx0Lyog0JTQtdC70LDQtdC8INC/0YDQvtCy0LXRgNC60YM6INCV0YHQu9C4INCy0YvQv9Cw0LTQsNGO0YnQuNC5INCx0LvQvtC6INGB0LrRgNGL0YIg0YLQviDQtNC10LvQsNC10Lwg0LXQs9C+INCy0LjQtNC40LzRi9C8Ki9cclxuXHRpZiggZHJvcEJsb2NrLmlzKCc6aGlkZGVuJykgKSB7XHJcblx0XHRkcm9wQmxvY2suc2xpZGVEb3duKCk7XHJcblx0XHRcclxuXHRcdC8qINCS0YvQtNC10LvRj9C10Lwg0YHRgdGL0LvQutGDINC+0YLQutGA0YvQstCw0Y7RidGD0Y4gc2VsZWN0ICovXHJcblx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcclxuXHRcdC8qINCg0LDQsdC+0YLQsNC10Lwg0YEg0YHQvtCx0YvRgtC40LXQvCDQutC70LjQutCwINC/0L4g0Y3Qu9C10LzQtdC90YLQsNC8INCy0YvQv9Cw0LTQsNGO0YnQtdCz0L4g0YHQv9C40YHQutCwICovXHJcblx0XHQkKCcuZHJvcF9kJykuZmluZCgnLmRpZCcpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiDQl9Cw0L3QvtGB0LjQvCDQsiDQv9C10YDQtdC80LXQvdC90YPRjiBIVE1MINC60L7QtCDRjdC70LXQvNC10L3RgtCwIFxyXG5cdFx0XHTRgdC/0LjRgdC60LAg0L/QviDQutC+0YLQvtGA0L7QvNGDINC60LvQuNC60L3Rg9C70LggKi9cclxuXHRcdFx0dmFyIHNlbGVjdFJlc3VsdF9lZCA9ICQodGhpcykuaHRtbCgpO1xyXG5cdFx0XHRcclxuXHRcdFx0Lyog0J3QsNGF0L7QtNC40Lwg0L3QsNGIINGB0LrRgNGL0YLRi9C5INC40L3Qv9GD0YIg0Lgg0L/QtdGA0LXQtNCw0LXQvCDQsiDQvdC10LPQviBcclxuXHRcdFx00LfQvdCw0YfQtdC90LjQtSDQuNC3INC/0LXRgNC10LzQtdC90L3QvtC5IHNlbGVjdFJlc3VsdCAqL1xyXG5cdFx0XHQkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoJy5lZHVjYXQgaW5wdXQnKS52YWwoc2VsZWN0UmVzdWx0X2VkKTtcclxuXHRcdFx0XHJcblx0XHRcdC8qINCf0LXRgNC10LTQsNC10Lwg0LfQvdCw0YfQtdC90LjQtSDQv9C10YDQtdC80LXQvdC90L7QuSBzZWxlY3RSZXN1bHQg0LIg0YHRgdGL0LvQutGDINC60L7RgtC+0YDQsNGPIFxyXG5cdFx0XHTQvtGC0LrRgNGL0LLQsNC10YIg0L3QsNGIINCy0YvQv9Cw0LTQsNGO0YnQuNC5INGB0L/QuNGB0L7QuiDQuCDRg9C00LDQu9GP0LXQvCDQsNC60YLQuNCy0L3QvtGB0YLRjCAqL1xyXG5cdFx0XHQkKCcuc2xjdF9kJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLmh0bWwoc2VsZWN0UmVzdWx0X2VkKSxcclxuXHRcdFx0XHJcblx0XHRcdC8qINCh0LrRgNGL0LLQsNC10Lwg0LLRi9C/0LDQtNCw0Y7RidC40Lkg0LHQu9C+0LogKi9cclxuXHRcdFx0ZHJvcEJsb2NrLnNsaWRlVXAoKTtcclxuXHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdC8qINCf0YDQvtC00L7Qu9C20LDQtdC8INC/0YDQvtCy0LXRgNC60YM6INCV0YHQu9C4INCy0YvQv9Cw0LTQsNGO0YnQuNC5INCx0LvQvtC6INC90LUg0YHQutGA0YvRgiDRgtC+INGB0LrRgNGL0LLQsNC10Lwg0LXQs9C+ICovXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0ZHJvcEJsb2NrLnNsaWRlVXAoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Lyog0J/RgNC10LTQvtGC0LLRgNCw0YnQsNC10Lwg0L7QsdGL0YfQvdC+0LUg0L/QvtCy0LXQtNC10L3QuNC1INGB0YHRi9C70LrQuCDQv9GA0Lgg0LrQu9C40LrQtSAqL1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0pO1x0XHJcblx0Ly8gU2VsZWN0XHJcblx0JCgnLnNsY3RfZScpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQvKiDQl9Cw0L3QvtGB0LjQvCDQstGL0L/QsNC00LDRjtGJ0LjQuSDRgdC/0LjRgdC+0Log0LIg0L/QtdGA0LXQvNC10L3QvdGD0Y4gKi9cclxuXHRcdHZhciBkcm9wQmxvY2sgPSAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5kcm9wX2UnKTtcclxuXHRcdFxyXG5cdFx0Lyog0JTQtdC70LDQtdC8INC/0YDQvtCy0LXRgNC60YM6INCV0YHQu9C4INCy0YvQv9Cw0LTQsNGO0YnQuNC5INCx0LvQvtC6INGB0LrRgNGL0YIg0YLQviDQtNC10LvQsNC10Lwg0LXQs9C+INCy0LjQtNC40LzRi9C8Ki9cclxuXHRcdGlmKCBkcm9wQmxvY2suaXMoJzpoaWRkZW4nKSApIHtcclxuXHRcdFx0ZHJvcEJsb2NrLnNsaWRlRG93bigpO1xyXG5cdFx0XHRcclxuXHRcdFx0Lyog0JLRi9C00LXQu9GP0LXQvCDRgdGB0YvQu9C60YMg0L7RgtC60YDRi9Cy0LDRjtGJ0YPRjiBzZWxlY3QgKi9cclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFxyXG5cdFx0XHQvKiDQoNCw0LHQvtGC0LDQtdC8INGBINGB0L7QsdGL0YLQuNC10Lwg0LrQu9C40LrQsCDQv9C+INGN0LvQtdC80LXQvdGC0LDQvCDQstGL0L/QsNC00LDRjtGJ0LXQs9C+INGB0L/QuNGB0LrQsCAqL1xyXG5cdFx0XHQkKCcuZHJvcF9lJykuZmluZCgnLmRpZScpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Lyog0JfQsNC90L7RgdC40Lwg0LIg0L/QtdGA0LXQvNC10L3QvdGD0Y4gSFRNTCDQutC+0LQg0Y3Qu9C10LzQtdC90YLQsCBcclxuXHRcdFx0XHTRgdC/0LjRgdC60LAg0L/QviDQutC+0YLQvtGA0L7QvNGDINC60LvQuNC60L3Rg9C70LggKi9cclxuXHRcdFx0XHR2YXIgc2VsZWN0UmVzdWx0X2VkID0gJCh0aGlzKS5odG1sKCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Lyog0J3QsNGF0L7QtNC40Lwg0L3QsNGIINGB0LrRgNGL0YLRi9C5INC40L3Qv9GD0YIg0Lgg0L/QtdGA0LXQtNCw0LXQvCDQsiDQvdC10LPQviBcclxuXHRcdFx0XHTQt9C90LDRh9C10L3QuNC1INC40Lcg0L/QtdGA0LXQvNC10L3QvdC+0Lkgc2VsZWN0UmVzdWx0ICovXHJcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuZWR1Y2F0IGlucHV0JykudmFsKHNlbGVjdFJlc3VsdF9lZCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Lyog0J/QtdGA0LXQtNCw0LXQvCDQt9C90LDRh9C10L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5IHNlbGVjdFJlc3VsdCDQsiDRgdGB0YvQu9C60YMg0LrQvtGC0L7RgNCw0Y8gXHJcblx0XHRcdFx00L7RgtC60YDRi9Cy0LDQtdGCINC90LDRiCDQstGL0L/QsNC00LDRjtGJ0LjQuSDRgdC/0LjRgdC+0Log0Lgg0YPQtNCw0LvRj9C10Lwg0LDQutGC0LjQstC90L7RgdGC0YwgKi9cclxuXHRcdFx0XHQkKCcuc2xjdF9lJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLmh0bWwoc2VsZWN0UmVzdWx0X2VkKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKiDQodC60YDRi9Cy0LDQtdC8INCy0YvQv9Cw0LTQsNGO0YnQuNC5INCx0LvQvtC6ICovXHJcblx0XHRcdFx0ZHJvcEJsb2NrLnNsaWRlVXAoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0Lyog0J/RgNC+0LTQvtC70LbQsNC10Lwg0L/RgNC+0LLQtdGA0LrRgzog0JXRgdC70Lgg0LLRi9C/0LDQtNCw0Y7RidC40Lkg0LHQu9C+0Log0L3QtSDRgdC60YDRi9GCINGC0L4g0YHQutGA0YvQstCw0LXQvCDQtdCz0L4gKi9cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHRkcm9wQmxvY2suc2xpZGVVcCgpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvKiDQn9GA0LXQtNC+0YLQstGA0LDRidCw0LXQvCDQvtCx0YvRh9C90L7QtSDQv9C+0LLQtdC00LXQvdC40LUg0YHRgdGL0LvQutC4INC/0YDQuCDQutC70LjQutC1ICovXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSk7XHRcclxuXHRcdFxyXG5cdFx0XHJcbiJdfQ==
