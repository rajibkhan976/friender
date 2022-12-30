import e from 'cors'
import {useEffect, useRef, useState} from 'react'
import { SearchIcon } from '../../assets/icons/Icons'

const SearchField = ({extraClass,placeholderText="Search...", onSearch,ArrayToSearch=[], setSearch, isSearch}) => {
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState('')

  // const searchItems = (searchValue) => {
  //   const filteredData = ArrayToSearch.sub_dmfs.filter((item) => 
  //         item.subdmf_name.toLowerCase().includes(searchValue.toLowerCase())
  //     // {console.log(searchValue, item.subdmf_name.toLowerCase().includes(searchValue.toLowerCase()))}
  //   // {
  //   //     return Object.values(item).join('').toLowerCase().includes(searchValue.toLowerCase())
  //   // }
  //   )
  //   console.log("filter dat from search",filteredData);
  //   onSearch({
  //       ...ArrayToSearch,
  //       sub_dmfs:filteredData}
  //   )
  // }
  
  useEffect(() =>  {
    const filteredData = ArrayToSearch.sub_dmfs.filter((item) => 
          item.subdmf_name.toLowerCase().includes(searchText.toLowerCase())
    )
    console.log("filter dat from search",filteredData);
    onSearch({
        ...ArrayToSearch,
        sub_dmfs:filteredData}
    )
  }, [searchText])

  useEffect(() => {
    if(isSearch) {
      searchRef.current.value = "";
      setSearchText('')
    }
  }, [isSearch])

  useEffect(() => {
    console.log('this');
    searchRef.current.value = "";
    setSearchText('')
  }, [ArrayToSearch])
    
  return (
    <div className="search-wraper d-flexsearch-field">
        <span><SearchIcon/></span>
        <input 
          ref={searchRef}
          className="search-field"
          placeholder={placeholderText}
          value={searchText}
          onChange={(e)=>{setSearchText(e.target.value)}}
        />
      
    </div>
  )
}

export default SearchField
