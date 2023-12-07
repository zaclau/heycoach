import React from 'react';
import { DialogContent, DialogOverlay } from "@reach/dialog";
import "./filtermodal.css";

const FilterModal = React.forwardRef(({ children, onApply, onDismiss }, ref) => {
    return (
        <DialogOverlay className="filter-modal">
            <DialogContent
                ref={ref}
                className="filter-modal__wrapper"
                aria-label="modal window"
                onDismiss={onDismiss}
            >
                <div classname="filter-modal__header">
                    <button onclick="{onDismiss}">x</button>
                </div>
                <div className="filter-modal__content">{children}
                    <div className="filter-modal__actions">
                        <button onClick={onApply}>Apply</button>
                    </div>
                </div>
            </DialogContent>
        </DialogOverlay>
    );
});
export default FilterModal;