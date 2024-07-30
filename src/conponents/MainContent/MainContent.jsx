'use client';
import {useState} from 'react';
import {CollapseItem} from "@/conponents/MainContent/CollapseItem";
import {TextField} from "@mui/material";



export const MainContent = () => {
    const [content, setFileContent] = useState();

    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useState(null);
    const [expandedKeys, setExpandedKeys] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
               const data = JSON.parse(e.target.result);

               setFileContent(data);
               setFilteredData(filterData(data, searchValue));
            };

            reader.readAsText(file);
        }
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchValue(searchValue);

        if (content) {
            setFilteredData(filterData(content, searchValue));
        }
    };

    const filterData = (data, search) => {
        const searchLower = search.toLowerCase();

        const matchesSearchTerm = (node) => {
            if (typeof node === 'string') {
                return node.toLowerCase().includes(searchLower);
            }

            if (typeof node === 'object' && node !== null) {

                return Object.entries(node).some(([key, value]) => {
                    if (key.toLowerCase().includes(searchLower)) {
                        return true;
                    }
                    if (typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
                        return true;
                    }
                    return matchesSearchTerm(value);
                });
            }

            return false;
        };

        const buildFilteredData = (node) => {
            if (typeof node === 'object' && node !== null) {
                const filteredNode = {};

                Object.entries(node).forEach(([key, value]) => {
                    if (matchesSearchTerm(value)) {
                        filteredNode[key] = buildFilteredData(value);
                    }
                });

                return filteredNode;
            }
            return node;
        };

        return buildFilteredData(data);
    };


    const handleToggle = (key) => {
        setExpandedKeys((prev) => {
            const updated = new Set(prev);

            if (updated.has(key)) {
                updated.delete(key);
            } else {
                updated.add(key);
            }

            return Array.from(updated);
        });
    };


    return (
        <div className="main-content">
            <input type="file" accept="application/json" onChange={handleFileUpload} />
            {content && <TextField
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchValue}
                onChange={handleSearchChange}
            />}
            {filteredData && (<CollapseItem data={filteredData} level={0} expandedKeys={expandedKeys} onToggle={handleToggle} />)}
        </div>
    );
};

