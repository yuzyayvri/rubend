import assert from "node:assert/strict";
import {finalProtocol,evaluationSlots} from "../bench/final-evaluation-protocol.mjs";
import {finalCampaignGroups,campaignTaskKey} from "../bench/final-evaluation-queue.mjs";
import {evaluationTaskInputs} from "../bench/evaluation-worker.mjs";

const protocol=finalProtocol(),groups=finalCampaignGroups(protocol),seen=new Set();assert.equal(groups.length,23);let tasks=0;for(const group of groups){assert.equal(new Set(group.tasks.map(campaignTaskKey)).size,group.tasks.length);let seconds=60;for(const task of group.tasks){const slots=evaluationSlots(protocol,task).filter(s=>s.cpu===task.cpu);assert.ok(slots.length>0);for(const slot of slots){assert.equal(seen.has(slot.id),false);seen.add(slot.id);}tasks++;if(!group.quality)seconds+=task.population==="long"?420:240;}if(group.quality)seconds+=1620;assert.ok(seconds<=1740,"Batch exceeds thirty-minute policy before verification slack");}assert.equal(seen.size,57678);assert.equal(tasks,102);console.log(JSON.stringify({passed:true,groups:groups.length,workerTasks:tasks,plannedSlots:seen.size,uniqueAndFullyCovered:true,eachBatchBelowThirtyMinutes:true,caseContentsRead:false,holdoutOpened:false}));
assert.throws(()=>evaluationTaskInputs(Object.freeze({stage:"final-frozen",protocol}),{population:"quality",chunk:0,cpu:2}),/validated freeze capability/);
