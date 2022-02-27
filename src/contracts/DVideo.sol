// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

contract DVideo {
    struct Video {
        uint256 id;
        string hashVal;
        string title;
        address author;
    }

    uint256 public videoCount = 0;
    string public name = "DappYoutube";

    mapping(uint256 => Video) public videos;

    event uploaded(uint256 id, string hashVal, string title, address author);

    function uploadVideo(string memory _videoHash, string memory _title)
        public
    {
        require(bytes(_videoHash).length > 0);
        require(bytes(_title).length > 0);
        require(msg.sender != address(0));

        videoCount++;
        videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);

        emit uploaded(videoCount, _videoHash, _title, msg.sender);
    }
}
