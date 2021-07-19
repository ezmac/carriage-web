#!/bin/bash
# Config path is default /usr/src/app/config
CONFIG_PATH="${CONFIG_PATH:-/usr/src/app}"

# set region for AWS calls (default us-east-1)
export AWS_DEFAULT_REGION="${AWS_REGION:-us-east-1}"


# functions to make things easier to understand
function fetch_ssm_param_value() {
  param_value=$(aws ssm get-parameter \
  --with-decryption \
  --name "${ssm_path}" \
  --output text --query 'Parameter.Value' )
  echo "${param_value}"
}

function write_ssm_to_file() { 
  ssm_path=$1
  output_file_path=$2
  ## TODO
  echo $output_file_path
  echo "`fetch_ssm_param_value $ssm_path`"> $output_file_path
  echo $output_file_path

}
function write_base64_ssm_to_file() { 
  ssm_path=$1
  output_file_path=$2
  echo $(fetch_ssm_param_value $ssm_path) \
  | base64 -d \
  > $output_file_path
  echo $output_file_path
}
# string_split string separator [result var name]
function string_split() {
  local IFS
  local  __resultvar=${3:-string_split_results_var}
  # https://www.linuxjournal.com/content/return-values-bash-functions
  # Because bash is so broken, we need to eval to assign a value to the variable stored in $__resultsvar
  # WARNING: this is a SECURITY VULN *IF* you let anyone control the arguments to this function.
  IFS=$2 eval read -ra $__resultvar <<< "$1"
  if [[ ! $3 ]]; then
    eval "echo \"\${$__resultvar[@]}\""
  fi

}
function debug_print(){
  if [[ ! -z "$DEBUG" ]]; then
    echo "$1"
  fi
}

#use the word SSM_ as a key for grouping any of these.
#use the word SSMT_ for a template if implemented like this. Or SSMTPL.  Not implemented yet.  sorry.
#use the following word as the path specifier.
#  **  If the X_PATH var is not set,  ** What do?
#use the remainder as file name.
#replace double underscore with slash.
#replace single underscore with dot.
function get_file_path() {
  local IFS
  declare -a parts
  file_path=/dev/null # if an env var doesn't match, we'll bin it to /dev/null and probably hard error.
  string_split $1 '_' parts
  debug_print "${parts[*]}"
  if [[ "${parts[0]}" == "SSM" ]]; then
    path_identifier="${parts[1]}_PATH"
    debug_print "$path_identifier"
    if [[ -v "$path_identifier" ]]; then
      file_path="${!path_identifier}"
      debug_print "file_path: $file_path"
    fi
    declare -a remaining_parts=(${parts[@]:2})
    # this is join.  it works, but to keep double underscore...
    # IFS='_' remainder="${remaining_parts[*]:-}"
    prefix="${parts[0]}_${parts[1]}_"
    remainder=`eval echo \""\${1#$prefix}"\"`
    debug_print "remainder: $remainder"
    # From here on, we're formatting the remaining path..
    output_file=${remainder//__//} # replace double underscore with /
    output_file=${output_file//_/.} # # replace underscore with dots
    output_file=${output_file,,} # to lower
    echo "${file_path}/${output_file}"
  fi
}

# This is the replacement for all the customized ssm entrypoints.
for i in ${!SSM_*}; do
  echo "$i"
  # indirection (use the value of i as a variable name)
  ssm_path=${!i}
  output_file=`get_file_path "$i"`
  echo $output_file
  path=`write_ssm_to_file "${ssm_path}" "$output_file"`
done

if [[ $CREATE_DYNAMO_TABLES == true ]]; then
  cd server
  npx ts-node createTables.ts
  cd -
fi

exec $@
