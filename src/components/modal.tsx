import React, { useState } from 'react';
import { Modal as BootstrapModal, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { ModalState } from '../models';
import { hidePopup } from '../actions';
import  Button  from './button';
import Icon from './icon';

interface PopupState {
  isResolved: boolean;
  resolving:boolean;
  rejecting:boolean;
  error ?: string;
  successMessage ?: string;
  modalWidth?:string;
  texttransform?:string;
}

const ModalPopup:React.FC = () => {
  const reduxDispatch = useDispatch();
  const popup:ModalState = useSelector((state:any) => state.popup);
  const [popupState, setPopupState] = useState<PopupState>({
    isResolved: false, resolving: false, rejecting: false,
  });
  const updatePopupSate = (params:Partial<PopupState>) => {
    setPopupState((prevSate) => ({
      ...prevSate, ...params,
    }));
  };
  const hideModal = () => {
    reduxDispatch(hidePopup());
    setPopupState({ isResolved: false, resolving: false, rejecting: false });
  };
  const { data } = popup;
  const successId = popupState.successMessage;
  const successMessage = successId && 'ss';
  const errorId = popupState.error;
  const errorMessage = errorId && 'ss';
  return (
    <BootstrapModal
      show={popup.show}
      centered
      aria-labelledby="contained-modal-title-vcenter"
      onHide={hideModal}
      className={popup.className}
      backdrop="static"

    >
      <BootstrapModal.Header
        style={{
          width: '100%',
        }}

      >
        <BootstrapModal.Title
          className={
            `modal-title modal-title--left  ${
              popup.texttransform ? `${popup.texttransform}` : 'capital-text'} `
          }
        >
          {popup.title && <FormattedMessage id={popup.title} values={data} />}
          &nbsp;
        </BootstrapModal.Title>
        <Icon
          onClick={hideModal}
          className="model-close cursor--pointer"
          name="close"
        />
      </BootstrapModal.Header>

      <BootstrapModal.Body>
        {typeof popup.body === 'string'
          ? (popup.body && <FormattedMessage tagName="p" id={popup.body} values={data} />)
          : popup.body(() => hideModal())}
        <div className="">
          {successMessage && (
          <Alert variant="success" className="mb-0">
            {successMessage}
          </Alert>
          )}
          {errorMessage && (
          <Alert variant="danger" className="mb-0">
            {errorMessage}
          </Alert>
          )}
        </div>
      </BootstrapModal.Body>
      {(popup.resolveText || popup.rejectText) && (
      <BootstrapModal.Footer
        style={{
          alignSelf: 'flex-end',
        }}
      >
        {popup.rejectText && !popupState.isResolved
          ? (
            <Button
              text={popup.rejectText}
              disabled={popupState.isResolved || popup.resolveDisabled || popupState.rejecting}
              isLoading={popupState.rejecting}
              onClick={() => {
                updatePopupSate({ rejecting: true });
                popup.reject()
                  .then(() => {
                    updatePopupSate(({
                      successMessage: undefined,
                      isResolved: true,
                      rejecting: false,
                    }));
                    hideModal();
                  })
                  .catch((error) => {
                    updatePopupSate(({
                      error: error?.message ?? (error ?? ''),
                      rejecting: false,
                    }));
                  });
              }}
            />
          ) : null}
          {popup.resolveText && !popupState.isResolved
            ? (
              <Button
                text={popup.resolveText}
                disabled={popupState.isResolved || popup.resolveDisabled}
                isLoading={popupState.resolving}
                onClick={() => {
                  updatePopupSate({ resolving: true });
                  popup.resolve()
                    .then(() => {
                      updatePopupSate(({
                        successMessage: popup.resolveMessage,
                        isResolved: true,
                        resolving: false,
                      }));
                      setTimeout(() => {
                        hideModal();
                      }, popup.resolveMessage ? 1700 : 0);
                    })
                    .catch((error) => {
                      updatePopupSate(({
                        error: error?.message ?? (error ?? ''),
                        resolving: false,
                      }));
                    });
                }}
              />
            ) : null }
      </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
};
export default ModalPopup;
