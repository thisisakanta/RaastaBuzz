package com.raastabuzz.dto.request;

import com.raastabuzz.model.VoteType;

import jakarta.validation.constraints.NotNull;

public class VoteRequest {
    
    @NotNull
    private VoteType voteType;
    
    public VoteRequest() {}
    
    public VoteRequest(VoteType voteType) {
        this.voteType = voteType;
    }
    
    public VoteType getVoteType() {
        return voteType;
    }
    
    public void setVoteType(VoteType voteType) {
        this.voteType = voteType;
    }
}
