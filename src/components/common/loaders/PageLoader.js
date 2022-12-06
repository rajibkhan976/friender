import { useEffect, useState } from "react";
import "../../../assets/scss/component/common/_page_loader.scss";

const pageLoader = {

}

const PageLoader = () => {
    return (
        <div className='page-loader d-flex d-flex-column'>
            <div className='page-loader-top d-flex'>
                <aside className={`page-loader-menu d-flex d-flex-column ${JSON.parse(localStorage.getItem('fr_sidebarToogle')) ? 'closed' : 'open'}`}>
                    <ul>
                        <li className="skeleton-loader"></li>
                        <li className="skeleton-loader"></li>
                        <li className="skeleton-loader"></li>
                    </ul>

                    <footer className="skeleton-loader"></footer>
                </aside>
                <div className='page-loader-body d-flex d-flex-column'>
                    <header className='page-loader-header d-flex'>
                        <div className='page-loader-title d-flex d-flex-column f-justify-center'>
                            <h1 className="skeleton-loader"></h1>
                            <p className="skeleton-loader"></p>
                        </div>
                        <div className='page-loader-options d-flex m-left-a f-align-center'>
                            <div className='page-header-options skeleton-loader'></div>
                            <div className='page-header-options skeleton-loader'></div>
                            <div className='page-header-options skeleton-loader'></div>
                            <div className='page-header-options skeleton-loader smaller'></div>
                            <div className='page-header-options skeleton-loader smaller'></div>
                        </div>
                    </header>
                    <div className="page-loader-mainSpace d-flex d-flex-column">
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
                </div>
            </div>
            <div className='page-loader-bottom skeleton-loader'></div>
        </div>
    );
};

export default PageLoader;