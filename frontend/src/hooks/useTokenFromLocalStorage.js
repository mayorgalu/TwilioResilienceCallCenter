import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import Axios from '../utils/Axios';

function useTokenFromLocalStorage(initialValue) {
  const [value, setValue] = useLocalStorage('token', initialValue);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    //chapter 41, use effect will change everytime a value above changes
    checkToken();
  }, [value]);

  async function checkToken() {
    //this function will call the backend using Axios
    const { data } = await Axios.post('/check-token', { token: value });
    console.log(value);
    console.log('CheckToken', data);
    setIsValid(data.isValid);
  }
  return [value, setValue, isValid]; //we want our data to access and return these
}

export default useTokenFromLocalStorage;
