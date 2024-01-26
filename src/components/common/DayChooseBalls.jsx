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
						moment(scheduleTime.date).format("dddd").substring(0, 2) ===
						week.day.substring(0, 2)
							? "today-circle"
							: ""
					}`}
					onClick={() =>
						setScheduleTime(() => {
							return {
								...scheduleTime,
								date: week.date,
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
