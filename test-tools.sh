#
#  File: test-tools.sh
#  Project: Asignment 2 https://github.com/jonathan-annett/pirple2
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

parse_json() {
  #bash function to parse JSON config parameters using node.js as a helper
  FILE="../.apis/$1.json"
  KEY=$2
  if [[ -e ${FILE} ]]; then
    if [[ "${KEY}" != "" ]]; then 
        node -e "console.log(JSON.parse(fs.readFileSync(\"$FILE\"))[\"$KEY\"]);"
    fi
  fi
}


# we are going to use the local host on port 3000 for this test
LOCAL_URL=http://localhost:3000/


# bash helper function to post JSON from stdin via curl
# captures JSON from the POST request and saves it to a local file
# usage: curl_post uri filename token 
curl_post() {
URI=$1
OUT=$2
if [[ "${OUT}" == "/dev/null" ]]; then
   JSON=./temp.in.json
   HDRS="/dev/null"
else
   JSON="${OUT}.in"
   HDRS="${OUT}.hdr"
fi

cat > ${JSON}

if [[ "$3" == "" ]] ; then
  curl -v --header "Content-Type: application/json" \
          --request POST \
          ${LOCAL_URL}/${URI} \
          --data @${JSON} > ${OUT} 2> curl.err
  echo -n "" > ${HDRS}
else
  echo -n " <=== Headers ====[ token: $3 ]" > ${HDRS}
  curl -v --header "Content-Type: application/json" \
          --header "token: $3" \
          --request POST \
          ${LOCAL_URL}/${URI} \
          --data @${JSON} > ${OUT} 2> curl.err
fi

    [[ "${OUT}" == "/dev/null" ]] && rm ./temp.in.json

    CODE=( $(grep "< HTTP/1" curl.err | cut -d "/" -f 2 ) )

    if [ ${CODE[1]} -ge 200 ] && [ ${CODE[1]} -lt 300 ] ; then
        true
    else
        false
    fi
}
