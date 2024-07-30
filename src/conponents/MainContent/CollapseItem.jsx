import {useEffect, useState} from "react";
import {Collapse, List, ListItemButton, ListItemText} from "@mui/material";

import {KEY_COLOR, PADDING, VALUE_COLOR} from "@/conponents/MainContent/constants";

import './styles.css';

const Label = ({ value, color }) => (
    <span style={{ color }} className="label">{value}</span>
);

const RecursiveListItem = ({ keyName, value, level, expandedKeys, onToggle }) => {
    const [open, setOpen] = useState(expandedKeys.includes(keyName));

    useEffect(() => {
        setOpen(expandedKeys.includes(keyName));
    }, [expandedKeys, keyName]);

    const handleClick = () => {
        setOpen(!open);
        onToggle(keyName);
    };

    const paddingLeft = `${level * PADDING}px`;

    if (Array.isArray(value)) {
        return (
            <List component="div" disablePadding>
                <ListItemButton sx={{paddingLeft}} onClick={handleClick}>
                    <ListItemText primary={<Label value={keyName} color={KEY_COLOR} />} />
                </ListItemButton>
                {value.map((item, index) => (
                    <ListItemButton key={index} sx={styles.paddingLeft(level + 1)}>
                        <ListItemText primary={<Label value={item} color={VALUE_COLOR} />} />
                    </ListItemButton>
                ))}
            </List>
        );
    }

    if (typeof value === 'object') {
        return (
            <>
                <ListItemButton onClick={handleClick} sx={{paddingLeft}}>
                    <ListItemText primary={<Label value={keyName} color={KEY_COLOR} />} />
                    <span style={{ marginLeft: 'auto' }}>{open ? '-' : '+'}</span>
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <CollapseItem data={value} level={level + 1} expandedKeys={expandedKeys} onToggle={onToggle} />
                </Collapse>
            </>
        );
    }

    return (
        <ListItemButton sx={{paddingLeft}}>
            <ListItemText primary={<span><Label value={`${keyName}:`} color={KEY_COLOR} /><Label value={value} color={VALUE_COLOR} /></span>} />
        </ListItemButton>
    );
};

export const CollapseItem = ({ data, level, expandedKeys, onToggle }) => {
    if (!data || typeof data !== 'object') return null;

    return (
        <List component="div" disablePadding>
            {Object.entries(data).map(([key, value]) => (
                <RecursiveListItem
                    key={key}
                    keyName={key}
                    value={value}
                    level={level}
                    expandedKeys={expandedKeys}
                    onToggle={onToggle}
                />
            ))}
        </List>
    );
};