#!/bin/bash

# Statistics Path Locations
# ==========================
# stat_path=/NFS/shared/homes/WebSites/PORTAL

#SLURM Job Log statistics                                                                          
#========================                                                                          
job_sta_file=slurmJobs.json
sacct -X --starttime=2024-01-01 --format=JobID,JobName,User,Partition,State,Start,ElapsedRaw > $job_sta_file  

# #Get Users Statisctics
# #=====================
# user_path=/NFS/scratch/homes
# user_list=( $(ls $user_path) )

#1) Storage Size
#---------------
output_file=userStorage.json
> $output_file
scratchUsed=$(df | grep scratch | awk '{print $3}')
sharedUsed=$(df | grep shared | awk '{print $3}')
echo "Scratch Used:$scratchUsed" >> $output_file
echo "Shared Used:$sharedUsed" >> $output_file
# echo "Username		Total" > $output_file
# echo "========		=====" >> $output_file
# for item in "${user_list[@]}"; do
# 	total_size=$(du -sh $user_path/$item | awk '{print $1}' )
# 	echo "$item		$total_size" >> $output_file
# done

# #2) Submitted Jobs
# #-----------------
# output_file=userJobs.json
# > $output_file
# echo "Username		Total" > $output_file
# echo "========		=====" >> $output_file
# for item in "${user_list[@]}"; do
# 	user_8s="${item:0:8}"
# 	line_count=$(grep -o $user_8s $job_sta_file | wc -l)                                   
# 	echo "$item		$line_count" >> $output_file
# done


#Get Job Statistics
#==================
                                                                                    
#1) Format - Last six months
#--------------------------=
output_file=jobs6months.json                                                                
> $output_file                                                                               
echo "Total: $total_count" >> $output_file
#declare -a sta_months
for i in {0..5}; do
	j=$((i - 5))
	y=$(date +%Y)
	m=$( (date -d "$(date +%Y-%m-1) $j month" +%m))
	sta_months[$i]="${y}-${m}"
	month_name[$i]="${y}-$(date -d "2000-$m-01" +%B)"
done
                                                                                             
# for (( i=0; i<${#sta_months[@]}; i++ )); do
# 	line_count=$(grep -o ${sta_months[i]} $job_sta_file | wc -l) 
# 	for item in "${user_list[@]}"; do
# 		user_8s="${item:0:8}"
# 		userMonths=$(grep -o ${sta_months[i]} $job_sta_file | grep -o $user_8s | wc -l)                                   
# 		echo "$item		$userMonths" >> $output_file
# 	done
	                         
# 	echo "${month_name[i]}: $line_count" >> $output_file                                            
# done 

#2) Job State Per Month
#----------------------
output_file=jobsStat.json
> $output_file
total_count=$(( $(wc -l < $job_sta_file) - 2))


string_to_find=("COMPLETED" "FAILED" "CANCELLED" "RUNNING" "PENDING")
other_count=0
echo "{" >> $output_file
echo "Total: $total_count" > $output_file

for search_string in "${string_to_find[@]}"; do
	for (( i=0; i<${#sta_months[@]}; i++ )); do
		line_count=$(grep $search_string $job_sta_file | grep -o ${sta_months[i]} | wc -l)
		echo ""${month_name[i]}-$search_string": "$line_count"" >> $output_file
	done
	line_count=$(grep -o $search_string $job_sta_file | wc -l)
	echo ""Total-$search_string": "$line_count"" >> $output_file
	other_count=$((other_count + line_count))
done
echo "}" >> $output_file

other_count=$((total_count - other_count))
echo "Other: $other_count" >> $output_file

#2) Job Partitions Per Month
#-----------------==========
output_file=jobsPartition.json                                                       
> $output_file                      
echo "{" > $output_file
echo "Total: $total_count" > $output_file
                                                                                             
part_array=("def1" "Res" "Dev")
cluster_array=("Project" "Research" "Developer")
        
for (( i=0; i<${#part_array[@]}; i++ )); do
    for (( j=0; j<${#sta_months[@]}; j++ )); do
		line_count=$(grep ${part_array[i]} $job_sta_file | grep -o ${sta_months[j]} | wc -l)
		echo "${month_name[j]} ${cluster_array[i]}: $line_count" >> $output_file
	done
	line_count=$(grep -o ${part_array[i]} $job_sta_file | wc -l)
    echo "${cluster_array[i]}: $line_count" >> $output_file                                   
done     
echo "}" >> $output_file
exit 0
