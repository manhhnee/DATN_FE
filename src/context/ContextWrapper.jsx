import React, { useState, useEffect, useReducer, useMemo } from 'react';
import GlobalContext from './GlobalContext';
import dayjs from 'dayjs';
import axiosInstance from '~/axiosConfig'; // Import axiosInstance

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case 'push':
      return [...state, payload];
    case 'update':
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case 'delete':
      return state.filter((evt) => evt.id !== payload.id);
    case 'set':
      return payload; // Add this case to set the initial fetched events
    default:
      throw new Error();
  }
}

function initIsLoggedIn() {
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
  return storedIsLoggedIn === 'true';
}

function initUserId() {
  const userId = localStorage.getItem('userId');
  return userId;
}

function initRole() {
  const role = localStorage.getItem('Role');
  return role;
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, []);
  const [isLoggedIn, setIsLoggedIn] = useState(initIsLoggedIn);
  const [userId, setUserId] = useState(initUserId);
  const [role, setRole] = useState(initRole);

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label),
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  useEffect(() => {
    localStorage.setItem('Role', role);
  }, [role]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await axiosInstance.get(`/users/${userId}/notes`);
        const fetchedNotes = response.data.data;
        dispatchCalEvent({ type: 'set', payload: fetchedNotes });
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }

    if (isLoggedIn && userId) {
      fetchNotes();
    }
  }, [isLoggedIn, userId]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        isLoggedIn,
        setIsLoggedIn,
        userId,
        setUserId,
        role,
        setRole,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
