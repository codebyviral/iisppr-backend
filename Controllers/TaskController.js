import Task from '../Models/Task.js';

// adding new task
export const addTask = async(req,res) => {
    const { assignedTo, title, description, startDate, endDate, status } = req.body;

    if(!assignedTo || !title || !description || !startDate || !endDate || !status) {
        res.status(400).json({error: "please fill all the fields"});
    }

    try {
        const addTask = new Task({
            assignedTo, title, description, startDate, endDate, status
        });

        const storeData = await addTask.save();
        console.log(storeData);
        res.status(200).json({storeData});
    } catch(error) {
        res.status(400).json(error);
    }
};
  
  
//getting all the tasks
export const getTasks = async(req, res) => {  
    try {
        const { userId } = req.params;
        const tasksData = await Task.find({assignedTo:userId});
        console.log(tasksData);
        res.status(200).json({tasksData});
    } catch(error) {
        res.status(400).json(error);
    }
};
  
  
//updating task 
export const updateTask = async(req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if(!updatedTask) {
            return res.status(400).json({error: "Task not found"});
        } 

        console.log(updatedTask);
        res.status(200).json({updatedTask});
    } catch(error) {
        res.status(400).json(error);
    }
};
  
  
//deleting task
export const deleteTask = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete({_id:id});

        res.status(200).json(deletedTask);
    } catch(error) {
        res.status(400).json(error);
    }
};

