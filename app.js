const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 3001;

// Utility functions
function getMean(nums) {
  const total = nums.reduce((acc, num) => acc + num, 0);
  return total / nums.length;
}

function getMedian(nums) {
  nums.sort((a, b) => a - b);
  const mid = Math.floor(nums.length / 2);
  return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function getMode(nums) {
  const freq = {};
  let maxFreq = 0;
  let mode;
  nums.forEach(num => {
    freq[num] = (freq[num] || 0) + 1;
    if (freq[num] > maxFreq) {
      maxFreq = freq[num];
      mode = num;
    }
  });
  return mode;
}

// Helper function to format the timestamp
function getTimestamp() {
  return new Date().toISOString();
}

function output(content, out) {
  const timestampedContent = `${getTimestamp()}\n${content}\n\n`;
  if (out) {
    fs.appendFile(out, timestampedContent, 'utf8', err => {
      if (err) {
        console.error(`Couldn't write ${out}:\n  ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(content);
  }
}

// Helper function to process data based on Accept header
function respond(req, res, data) {
  if (req.headers.accept === 'text/html') {
    res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
  } else {
    res.json(data);
  }
}

// Route to handle mean
app.get('/mean', (req, res) => {
  const numsStr = req.query.nums;
  if (!numsStr) {
    return res.status(400).json({ error: 'nums are required.' });
  }
  const nums = numsStr.split(',').map(num => {
    const parsedNum = parseFloat(num);
    if (isNaN(parsedNum)) {
      throw new Error(`${num} is not a number.`);
    }
    return parsedNum;
  });
  respond(req, res, { operation: 'mean', value: getMean(nums) });
});

// Route to handle median
app.get('/median', (req, res) => {
  const numsStr = req.query.nums;
  if (!numsStr) {
    return res.status(400).json({ error: 'nums are required.' });
  }
  const nums = numsStr.split(',').map(num => {
    const parsedNum = parseFloat(num);
    if (isNaN(parsedNum)) {
      throw new Error(`${num} is not a number.`);
    }
    return parsedNum;
  });
  respond(req, res, { operation: 'median', value: getMedian(nums) });
});

// Route to handle mode
app.get('/mode', (req, res) => {
  const numsStr = req.query.nums;
  if (!numsStr) {
    return res.status(400).json({ error: 'nums are required.' });
  }
  const nums = numsStr.split(',').map(num => {
    const parsedNum = parseFloat(num);
    if (isNaN(parsedNum)) {
      throw new Error(`${num} is not a number.`);
    }
    return parsedNum;
  });
  respond(req, res, { operation: 'mode', value: getMode(nums) });
});

// Route to handle all operations
app.get('/all', (req, res) => {
  const numsStr = req.query.nums;
  if (!numsStr) {
    return res.status(400).json({ error: 'nums are required.' });
  }
  const nums = numsStr.split(',').map(num => {
    const parsedNum = parseFloat(num);
    if (isNaN(parsedNum)) {
      throw new Error(`${num} is not a number.`);
    }
    return parsedNum;
  });
  respond(req, res, {
    operation: 'all',
    mean: getMean(nums),
    median: getMedian(nums),
    mode: getMode(nums),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
