import { useEffect } from "react";
import "../../../assets/scss/component/common/_list-loader.scss"

const ListLoader = ({additionalClass}) => {
	useEffect(() => {
		console.log(!JSON.parse(localStorage.getItem('fr_sidebarToogle')))
	})
    return (
			// <div className='list-loader'>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// 	<div className='page-loader-row skeleton-loader'></div>
			// </div>
			<div className={`
				page-loader-mainSpace 
				d-flex 
				d-flex-column 
				list-loader 
					${JSON.parse(localStorage.getItem('fr_sidebarToogle')) ? 
						'sidebar-open':''
					}
				`
			}>
				<div className='page-loader-tableHeader d-flex f-justify-between'>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
					<span className="skeleton-loader"></span>
				</div>
				<div className='page-loader-tableBody'>
					<div className='page-loader-row skeleton-loader'></div>
					<div className='page-loader-row skeleton-loader'></div>
					<div className='page-loader-row skeleton-loader'></div>
					<div className='page-loader-row skeleton-loader'></div>
					<div className='page-loader-row skeleton-loader'></div>
					<div className='page-loader-row skeleton-loader'></div>
					<div className='page-loader-row skeleton-loader'></div>
					<div className='page-loader-row skeleton-loader'></div>
				</div>
				<div className='page-loader-pagination d-flex f-justify-center'>
					<div className='page-loader-numbers skeleton-loader'></div>
					<div className='page-loader-pageSet skeleton-loader'></div>
				</div>
			</div>
		);
};

export default ListLoader;