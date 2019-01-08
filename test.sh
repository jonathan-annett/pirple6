#
#  File: test.sh
#  Project: Asignment 6 https://github.com/jonathan-annett/pirple6
#  Synopsis: test script to demonstrate required functionality.
#
#  Arguments: none
#

#
# Copyright 2018 Jonathan Annett
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
# and associated documentation files (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
# and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
# subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all copies or substantial portions
# of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#


source test-tools.sh $1

    echo posting message to hello route on server
    if curl_post hello ./test-post.json << TEST_JSON
    {
        "answer" : 42,
        "topic"  : ["life",univervse","everything"],
        "meta"   : "Dont' Panic"
    }
TEST_JSON

    then
        
        node -e "console.log(JSON.stringify(JSON.parse(fs.readFileSync(\"./test-post.json\")),undefined,4));"

    else
    
        echo test failed
    fi