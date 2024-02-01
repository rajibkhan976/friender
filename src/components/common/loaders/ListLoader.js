import "../../../assets/scss/component/common/_list-loader.scss"

const ListLoader = () => {
    return (
			<div className='list-loader'>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
				<div className='page-loader-row skeleton-loader'></div>
			</div>
		);
};

export default ListLoader;