import React from "react";
import './skeleton_modal.scss';
import { XMarkIcon } from 'assets/icons/Icons';


const SkeletonModal = ({ onCrossClick }) => (
    <>
        <div className="skeleton-loader-modal">
            <div className="skeleton-header">
                <div className="skeleton-circle"></div>
                <div className="skeleton-line fat-line"></div>

                <div className="skeleton-modal-close-icon">
                    <span
                        className="close-modal"
                        onClick={onCrossClick}
                    >
                        <XMarkIcon color="white" />
                    </span>
                </div>
            </div>

            <div className="skeleton-body">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line half-line"></div>
            </div>

            <div className="skeleton-footer">
                <div className="skeleton-button"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    </>

);

export default SkeletonModal;