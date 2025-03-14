// Временные слоты с объединением времени
const timeSlots = [
    ["08:20", "09:55"],
    ["10:05", "11:40"],
    ["12:05", "13:40"],
    ["13:55", "15:30"],
    ["15:40", "17:15"],
    ["17:25", "19:00"],
    ["19:10", "20:45"]
];

document.addEventListener('DOMContentLoaded', function () {
    // Статические данные для тестирования
    const data = [
        {
            time: "08:20 - 09:55",
            teacher: "Иванов И.И.",
            group: "Группа 1",
            room: "101",
            day: "Понедельник",
            subject: "Математика"
        },
        {
            time: "10:05 - 11:40",
            teacher: "Иванов И.И.",
            group: "Группа 2",
            room: "102",
            day: "Понедельник",
            subject: "Физика"
        },
        {
            time: "12:05 - 13:40",
            teacher: "Сидоров С.С.",
            group: "Группа 3",
            room: "103",
            day: "Вторник",
            subject:"Программирование"
        },
        {
            time:"13.55 - 15.30",
            teacher:"Кузнецова А.А.",
            group:"Группа 1",
            room:"104",
            day:"Четверг",
            subject:"Химия"
        },
        {
            time:"15.40 - 17.15",
            teacher:"Смирнов С.С.",
            group:"Группа 2",
            room:"105",
            day:"Пятница",
            subject:"История"
        },
        {
            time:"17.25 - 19.00",
            teacher:"Петрова А.А.",
            group:"Группа 3",
            room:"106",
            day:"Суббота",
            subject:"Английский язык"
        },
        {
            time:"19.10 - 20.45",
            teacher:"Сидорова С.С.",
            group:"Группа 1",
            room:"107",
            day:"Воскресенье",
            subject:"Философия"
        }
    ];

    // Заполняем таблицы при загрузке
    populateTable(data);
    populateEditTable(data);

    // Обработчик для кнопки добавления нового занятия
    document.getElementById('addScheduleButton').addEventListener('click', function () {
        const newEntry = {
            time:
                document.getElementById('time').value,
            teacher:
                document.getElementById('teacher').value,
            group:
                document.getElementById('group').value,
            room:
                document.getElementById('room').value,
            day:
                document.getElementById('day').value,
        };

        // Добавляем новое занятие в массив данных
        data.push(newEntry);

        // Обновляем таблицы
        populateTable(data);
        populateEditTable(data);

        // Очищаем форму
        document.getElementById('editForm').reset();
    });

    // Обработчик для сохранения изменений в редактируемой таблице
    document.getElementById('saveChangesButton').addEventListener('click', function () {
        const editRows = document.querySelectorAll('#editTable tbody tr');

        editRows.forEach((row, rowIndex) => {
            const time = `${timeSlots[rowIndex][0]} - ${timeSlots[rowIndex][1]}`;
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, cellIndex) => {
                if (cellIndex === 0) return; // Пропускаем первый столбец с временем

                const day = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'][cellIndex - 1];
                const content = cell.innerText.split('\n');

                // Находим или создаем запись
                let entry = data.find(item => item.time === time && item.day === day);
                if (entry) {
                    // Обновляем существующую запись
                    entry.teacher = content[0] || "";
                    entry.group = content[1] || "";
                    entry.room = content[2] || "";
                } else if (content.some(Boolean)) {
                    // Создаем новую запись, если есть данные
                    data.push({
                        time,
                        teacher:
                            content[0] || "",
                        group:
                            content[1] || "",
                        room:
                            content[2] || "",
                        day,
                    });
                }
            });
        });

        // Обновляем основную таблицу
        populateTable(data);
    });

    // Обработчик для переключения вкладок
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
			event.preventDefault();

			const selectedTab = this.getAttribute('data-tab');

			document.querySelectorAll('.tab-content').forEach(content => {
				content.classList.remove('active');
			});

			document.getElementById(selectedTab + 'Schedule').classList.add('active');
			
			// Если открыта вкладка преподавателей, заполняем таблицу преподавателей
			if (selectedTab === 'teacher') {
				populateTeacherTable(data);
			}
		});
	});

	// Добавляем обработчик поиска по преподавателям
	const teacherSearchInput = document.getElementById("teacherSearch");
	if (teacherSearchInput) {
		teacherSearchInput.addEventListener("input", function () {
			const searchTerm = this.value.toLowerCase();

			// Фильтруем данные по преподавателю
			const filteredData = data.filter((item) =>
				item.teacher.toLowerCase().includes(searchTerm)
			);

			// Заполняем таблицу преподавателей на основе фильтрации
			populateTeacherTable(filteredData);
		});
	}
});

// Функция для заполнения основной таблицы расписания
function populateTable(data) {
	const scheduleTableBody =
		document.getElementById("scheduleTable").getElementsByTagName("tbody")[0];
	scheduleTableBody.innerHTML = "";

	timeSlots.forEach((slot) => {
		const row = scheduleTableBody.insertRow();
		const time = `${slot[0]} - ${slot[1]}`;

		row.insertCell(0).innerText = time;

		["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].forEach(day => {
			const cell = row.insertCell();

			const entry = data.find(item => item.time === time && item.day === day);

			if (entry) {
				cell.innerText = `${entry.teacher}\n${entry.group}\n${entry.room}`;
				cell.style.whiteSpace = 'pre-wrap'; // Перенос текста на новую строку
			}
		});
	});
}

// Функция для заполнения таблицы редактирования
function populateEditTable(data) {
	const editTableBody =
		document.getElementById("editTable").getElementsByTagName("tbody")[0];
	editTableBody.innerHTML = "";

	timeSlots.forEach((slot) => {
		const row = editTableBody.insertRow();
		const time = `${slot[0]} - ${slot[1]}`;

		row.insertCell(0).innerText = time;

		["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].forEach(day => {
			const cell = row.insertCell();

			const entry = data.find(item => item.time === time && item.day === day);

			if (entry) {
				cell.contentEditable = true; // Делаем ячейку редактируемой
				cell.innerText = `${entry.teacher}\n${entry.group}\n${entry.room}`;
				cell.style.whiteSpace = 'pre-wrap'; // Позволяет переносить текст на новую строку
			} else {
				cell.contentEditable = true; // Делаем ячейку редактируемой, если записи нет
				cell.innerText = '';
			}
		});
	});
}

// Функция для заполнения таблицы преподавателей
function populateTeacherTable(filteredData) {
	const teacherTableBody =
		document.getElementById("teacherTable").getElementsByTagName("tbody")[0];
	
	teacherTableBody.innerHTML = ""; // Очищаем предыдущие данные

    filteredData.forEach(item => {
		const row = teacherTableBody.insertRow();
		
		row.insertCell(0).innerText = item.time;
		row.insertCell(1).innerText = item.day;
		row.insertCell(2).innerText = item.group;
		row.insertCell(3).innerText = item.room;
		row.insertCell(4).innerText = item.subject; // Добавляем предмет в таблицу преподавателей
	});
}
		
		
		
	
		
		
		
	
		
		
		
		
	
