import moment from "moment";

const DayChooseBalls = ({ scheduleTime, setScheduleTime }) => {
	const weekdaysArr = [
		{
			day: moment().startOf("W").format("dddd"),
			date: moment().startOf("W"),
		},
	];
	let iterator = 1;
	const buildOnWeekdaysArr = () => {
		weekdaysArr.push({
			day: moment().startOf("W").add("d", iterator).format("dddd"),
			date: moment().startOf("W").add("d", iterator),
		});
		iterator++;
		if (iterator < 7) {
			buildOnWeekdaysArr();
		}
	};
	buildOnWeekdaysArr();

	return (
		<div className='scheduler-popup-header-content'>
			{weekdaysArr.map((week, index) => (
				<div
					key={index}
					className={`popup-header-content-item ${
						scheduleTime?.date.some(
							(date) =>
								moment(date).format("dddd").substring(0, 2) ===
								week.day.substring(0, 2)
						)
							? "today-circle"
							: ""
					}`}
					onClick={() =>
						setScheduleTime(() => {
							return {
								...scheduleTime,
								date: scheduleTime.date.every(
									(item) =>
										moment(item).format("DD-MM-YYYY") !==
										moment(week.date).format("DD-MM-YYYY")
								)
									? [...scheduleTime.date, new Date(week.date)]
									: scheduleTime.date.filter(
											(item) =>
												moment(item).format("DD-MM-YYYY") !==
												moment(week.date).format("DD-MM-YYYY")
									  ),
							};
						})
					}
				>
					{week.day.substring(0, 2)}
				</div>
			))}
		</div>
	);
};

export default DayChooseBalls;
