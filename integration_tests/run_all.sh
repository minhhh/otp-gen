#!/bin/bash

TEST_PREFIX=otpgen
TESTDIR=~+/`dirname $0`
cd $TESTDIR

testcases=$(ls test_*.sh)

if [ "$1" != "" ]; then
    testcases="$@"
fi

for testcase in $testcases; do
    echo -n "Executing $testcase..."
    TMPDIR=`mktemp -d "${TEST_PREFIX}-${testcase}.XXXXXX"`
    OUTPUT="${TMPDIR}.log"
    ( cd $TMPDIR && . $TESTDIR/${testcase} >$OUTPUT 2>&1 ) ||
    # ( cd $TMPDIR && source $TESTDIR/${testcase} ) || # uncomment to debug
        {
      cat $TMPDIR/$OUTPUT
      echo "*** Test case $testcase failed ($TMPDIR)"
      echo "*** Output in $OUTPUT"
      exit 1
        }
    rm -r $TMPDIR || { echo "Couldn't clean up after test"; exit 1; }
    echo " OK"
done

echo "ALL TESTS COMPLETED"