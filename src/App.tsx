import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import Button from "@mui/material/Button";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type TodolistType = {
    id: string
    title: string
    filter: FilterValueType
}

export type TasksObjType = {
    [key: string]: TaskType[]
}
export type FilterValueType = 'all' | 'completed' | 'active'

function App() {

    let todolistId1 = v1()
    let todolistId2 = v1()

    let [todolists, setTodolist] = useState<TodolistType[]>([
        {id: todolistId1, title: 'What to lern', filter: 'active'},
        {id: todolistId2, title: 'What to bye', filter: 'completed'}
    ])

    let [taskObj, setTasks] = useState<TasksObjType>({
        [todolistId1]: [
            {id: v1(), title: "OPERA", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "CSS", isDone: false},
            {id: v1(), title: "1C", isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: "TEATRO", isDone: true},
            {id: v1(), title: "MIX", isDone: true},

        ]
    })
    function removeTask(todolistId: string, id: string) {
        taskObj[todolistId] = taskObj[todolistId].filter(t => t.id !== id);
        setTasks({...taskObj});
    }


    function addTask(title: string, todolistId: string) {
        debugger
        let task = {id: v1(), title: title, isDone: false}
        taskObj[todolistId] = [...taskObj[todolistId], task]
        console.log(taskObj)
        setTasks({...taskObj})
    }


    function changeTaskStatus(todolistId: string, taskId: string, isDone: boolean) {
        taskObj[todolistId] = taskObj[todolistId].map(el => el.id === taskId ?
            {...el, isDone: isDone} :
            el
        )
        setTasks({...taskObj})
    }

    function changeTaskTitle(todolistId: string, taskId: string, newTitle: string) {
        taskObj[todolistId] = taskObj[todolistId].map(el => el.id === taskId ?
            {...el, title: newTitle} :
            el
        )
        setTasks({...taskObj})
    }


    function changeFilter(value: FilterValueType, todolistId: string) {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolist([...todolists])
        }
    }

    const removeTodolist = (todolistId: string) => {
        let filteredTodolist = todolists.filter(tl => tl.id !== todolistId)
        setTodolist(filteredTodolist)
        delete taskObj[todolistId];
        setTasks({...taskObj})
    }
    const addTodolist = (title: string) => {
        let todolist: TodolistType = {
            id: v1(),
            filter: 'all',
            title: title
        }
        setTodolist([todolist, ...todolists])
        setTasks({...taskObj, [todolist.id]: []})
    }

    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        todolists = todolists.map(t => t.id === todolistId ?
            {...t, title: newTitle} :
            {...t}
        )
        setTodolist([...todolists])
    }



    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '10px'}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let tasksForTodolist = taskObj[tl.id];

                            if (tl.filter === 'completed') {
                                tasksForTodolist = tasksForTodolist.filter(t => t.isDone)
                            }
                            if (tl.filter === 'active') {
                                tasksForTodolist = tasksForTodolist.filter(t => !t.isDone)
                            }
                            return <Grid item>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>

            </Container>


        </div>
    );
}


export default App;
