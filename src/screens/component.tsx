import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setLocale as localeAction, showPopup as showPopupAction } from '../actions';
import {
  Button, Checkbox, SwipeToggleButton, RadioButton,
  TextField, Modal, Accordian, TabBar, SelectInput, DateTimeInput,
} from '../components';
import { Table } from '../components/table';

interface DispatchProps {
  setLocale: typeof localeAction;
  showPopup: typeof showPopupAction;
  state: any
}

const Home: React.FC<DispatchProps> = ({
  showPopup,
}) => {
  const [selected, setSelected] = useState(false);
  const [radioButton, setRadioButton] = useState(1);
  const [swipeButton, setSwipeButton] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>();
  const handleClick = () => {
    alert('yeah');
  };

  const onClickRadioButton = (data) => {
    setRadioButton(data);
  };
  const options = [
    {
      id: 1, name: 'jayesh', label: 'errors.check', component: <h1>sss</h1>,
    },
    { id: 2, name: 'jayesh', label: 'button' },
    { id: 3, name: 'jayesh', label: 'button 12' },
    { id: 4, name: 'jayesh', label: 'button 12' },
  ];

  const demoObj = {
    metadata: {
      order: 'name',
      direction: 'desc' as const,
      page: 1,
      limit: 10,
      total: 3,
      filters: { status: 'ACTIVE' },
      allowedFilters: [],
    },
    records: [
      {
        pId: 'P11',
        patient: 'harry',
        name: 'Test',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P12',
        patient: 'harry1',
        name: 'harry1',
        email: 'harry1@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P13',
        patient: 'harry2',
        name: 'abc',
        email: 'harry2@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P14',
        patient: 'harry3',
        name: 'xyz',
        email: 'harry3@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P15',
        patient: 'harry4',
        name: 'harry4',
        email: 'harry4@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'harry',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'tester',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'harry',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'harry',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'Tom',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'harry',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',
      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'harry',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'harry',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',

      },
      {
        pId: 'P11',
        patient: 'harry',
        name: 'harry',
        email: 'harry@gmail.com',
        code: 'UI371291',
        dob: 'Dec 1, 2020',
      },
    ],
  };

  const onClickSwipeButton = (data) => {
    setSwipeButton(data);
    // toast('success', 'Patient portal deleted successfully!', 'success-right');
    showPopup({
      title: '',
      body: 'sideBarOption.logoutBody',
      resolveText: 'sideBarOption.logoutText',
      rejectText: 'general.cancel',
      className: 'medium-width',
      // resolveWithPromise: () => onLogout(),

    });
  };
  return (

    <>
      <Container>
        <h1>Buttons</h1>
        Primary
        <div className="d-flex">
          <Button className="mr-1" text="button" onClick={handleClick} />
          <div className="ms-5 ">
            <Button className="" disabled text="button" onClick={handleClick} />
          </div>
        </div>

        Primary loading
        <div className="d-flex">
          <Button isLoading className="mr-1" text="button" onClick={handleClick} />
          <div className="ms-5">
            <Button className="" disabled text="button" onClick={handleClick} />
          </div>
        </div>
        secondary
        <div className="d-flex mt-1">
          <Button secondary text="button" onClick={handleClick} />
          <div className="ms-5">
            <Button secondary disabled text="button" onClick={handleClick} />
          </div>
        </div>

        <div className="d-flex mt-1">
          <Button secondary isLoading text="button" onClick={handleClick} />
          <div className="ms-5">
            <Button secondary disabled text="button" onClick={handleClick} />
          </div>
        </div>

        with icon
        <div className="d-flex mt-1">
          <Button icon="import" text="Import" onClick={handleClick} />
          <div className="ms-5">
            <Button disabled text="button" onClick={handleClick} />
          </div>
        </div>

        <h1>Check-box</h1>

        <Checkbox
          // isDisabled
          name="checkbox"
          className="className"
          value={selected}
          error={selected && 'errors.check'}
          label="Check box"
          onChange={(data) => {
            setSelected(!data);
          }}
        />

        <Checkbox
          isDisabled
          name="checkbox1"
          label="this is me"
          onChange={(data) => {
          }}
        />

        <Checkbox
          // isDisabled
          name="checkbox2"
          className="className"
          value={selected}
          label="Check box"
          error={selected && 'error'}
          onChange={(data) => {
            setSelected(!data);
          }}
        />

        <h1>Radio</h1>
        <RadioButton
          options={options}
          name="radio"
          onChange={(data) => {
            onClickRadioButton(data);
          }}
          value={radioButton}
        />

        <h1> swipe Toggle</h1>
        <SwipeToggleButton
          name="swipe"
          value={swipeButton}
          onChange={(data) => {
            onClickSwipeButton(data);
          }}
        />
        <h1 className="ss">Text input </h1>

        <TextField
          name="name"
          placeholder="hello"
          label="username"
          error="nameaaaaaaaaaaaa"
          value={inputValue}
          onChange={(data) => {
            setInputValue(data);
          }}
        />

        <TextField
          name="search"
          placeholder="hello"
          label="username"
          value={inputValue}
          className="icon"
          onChange={(data) => {
            setInputValue(data);
          }}
        />
        <div>
          <TextField
            name="search"
            placeholder="hello"
            label="username"
            iconName="search"
            value={inputValue}
            className="icon"
            onChange={(data) => {
              setInputValue(data);
            }}
          />

          <br />
          <TextField
            name="search"
            placeholder="hello"
            isDisabled
            label="username"
            value={inputValue}
            onChange={(data) => {
              setInputValue(data);
            }}
          />
        </div>

        <h1>table</h1>

        <Table
          name="companyMachinesRecords"
          data={demoObj.records}
          metadata={demoObj.metadata}
          pageSize={demoObj.metadata.limit}
          selectedPage={demoObj.metadata.page}
          onSelectedPageNumber={(page) => {
          }}

          specs={[
            { id: 'pId', name: 'patient.pId' },
            { id: 'patient', name: 'patient.patient' },
            { id: 'name', name: 'patient.patient' },
            { id: 'email', name: 'patient.email' },
            { id: 'code', name: 'patient.code' },
            { id: 'dob', name: 'patient.dob' },
          ]}
        />

        <h1>ss</h1>

        <TabBar
          name="tabbar"
          value={1}
          tabbar={
          [
            {
              id: 1,
              component: <h1> ss11</h1>,
              label: 'button',

            },
            {
              id: 2,
              component: <h1> ss12</h1>,
              label: 'button 12',
            },
            {
              id: 3,
              component: <h1> ss13</h1>,
              label: 'button 13',
            },
            {
              id: 4,
              component: <h1> ss14</h1>,
              label: 'button 14',
            },
          ]
        }
        />

      </Container>
      <div className="p-3" />
      <Modal />

      <h1>ddd</h1>
      <Accordian body="ssssssssssssssssssssssssss" headers={<h1>cc</h1>} />
      <br />

      <h1>dd</h1>
      <div className="width-date">
        <DateTimeInput name="ss" />

        <h1>select input</h1>

        <SelectInput
          options={options}
          name="ss"
          multiSelect
          value="1"
          // placeholder="errors.check"
        />
      </div>

    </>
  );
};

const mapStateToProps = (state: any): any => ({
  state,
});

export default connect<DispatchProps>(mapStateToProps, {
  showPopup: showPopupAction,
})(Home);
