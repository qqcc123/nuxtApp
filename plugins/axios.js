import * as axios from 'axios'

let options = {}

options.baseURL = "http://127.0.0.1:3005/"
export default axios.create(options)